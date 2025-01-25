import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/config'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    getAuth,
    sendPasswordResetEmail,
    setPersistence,
    updateProfile,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { useToast } from 'primevue/usetoast'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const error = ref(null)
    const loading = ref(false)
    const toast = useToast()

    const isAuthenticated = computed(() => auth.currentUser)
    const userRole = computed(() => auth.currentUser?.role || 'guest')

    async function register({ email, password, name, phones, role = 'customer', remember = false }) {
        try {
            loading.value = true;

            // Create user with email and password
            const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with display name
            await updateProfile(authUser, {
                displayName: name,
            });

            // Set user document in Firestore with additional details
            await setDoc(doc(db, 'users', authUser.uid), {
                name,
                email,
                role,
                phones,
                id: authUser.uid,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });

            // Set persistence if remember is true
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            );

            // Store user data
            user.value = {
                uid: authUser.uid || null,
                email: authUser.email || null,
                displayName: name || null,
                role: role || 'customer',
                phoneNumbers: phones || null
            };

            // Optional: Store some user info in localStorage for persistence
            if (remember) {
                localStorage.setItem('userRemembered', 'true');
                localStorage.setItem('userEmail', email);
            }
        } catch (err) {
            const errorMessage = getFirebaseErrorMessage(err.message);

            error.value = errorMessage;
            throw new Error(errorMessage);
        } finally {
            loading.value = false;
        }
    }

    async function login({ email, password, remember = false }, toast) {
        try {
            loading.value = true;

            // Set persistence based on remember me option
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            );

            // Perform login
            const { user: authUser } = await signInWithEmailAndPassword(auth, email, password);

            const userDoc = await getDoc(doc(db, 'users', authUser.uid));
            console.log(userDoc.data());

            // Enhanced user object with additional details
            user.value = {
                uid: authUser.uid,
                email: authUser.email,
                displayName: authUser.displayName,
                emailVerified: authUser.emailVerified,
                role: userDoc.data().role || 'customer',
                phoneNumbers: userDoc.data().phones || null
            };

            // Store user info in localStorage for persistence
            if (remember) {
                localStorage.setItem('userRemembered', 'true');
                localStorage.setItem('userEmail', email);
            }

            return user.value;
        } catch (err) {
            // Improved error handling
            const errorMessage = getFirebaseErrorMessage(err.message);

            error.value = errorMessage;
            toast.add({
                severity: 'error',
                summary: 'Помилка входу',
                detail: errorMessage,
                life: 3000
            });

            throw new Error(errorMessage);
        } finally {
            loading.value = false;
        }
    }

    // Add a method to check and restore session
    async function checkAuthPersistence() {
        const remembered = localStorage.getItem('userRemembered');
        const storedEmail = localStorage.getItem('userEmail');

        if (remembered && storedEmail) {
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    try {
                        // Fetch full user data from Firestore
                        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                        console.log(">>>", currentUser.uid, userDoc.data());

                        if (userDoc.exists()) {
                            user.value = {
                                uid: currentUser.uid,
                                email: currentUser.email,
                                displayName: currentUser.displayName,
                                emailVerified: currentUser.emailVerified,
                                role: userDoc.data().role || 'customer',
                                phones: userDoc.data().phones || null
                            };
                        }
                    } catch (error) {
                        console.error('Error restoring user session:', error);
                    }
                }
            });
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            user.value = null;

            // Clear remembered user data
            localStorage.removeItem('userRemembered');
            localStorage.removeItem('userEmail');
        } catch (err) {
            const errorMessage = getFirebaseErrorMessage(err.message);
            throw new Error(errorMessage);
        }
    }

    async function resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email)
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Електронний лист для зміни пароля надіслано. Будь ласка, перевірте свою поштову скриньку',
                life: 7000
            })
        } catch (err) {
            error.value = getFirebaseErrorMessage(err.message)
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.value,
                life: 3000
            })
            throw new Error(error.value)
        }
    }

    async function initializeAuth() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

                    if (userDoc.exists()) {
                        user.value = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            username: currentUser.displayName,
                            role: userDoc.data().role || 'customer',
                            phones: userDoc.data().phones || null,
                            emailVerified: currentUser.emailVerified
                        };
                    } else {
                        // Fallback if no Firestore document exists
                        user.value = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            username: currentUser.displayName,
                            role: 'customer',
                            emailVerified: currentUser.emailVerified
                        };
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    user.value = null;
                }
            } else {
                user.value = null;
            }
        });
    }

    return {
        user,
        error,
        loading,
        isAuthenticated,
        userRole,
        register,
        login,
        logout,
        resetPassword,
        initializeAuth,
        checkAuthPersistence
    }
})
