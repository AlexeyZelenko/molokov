import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/config'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    setPersistence,
    updateProfile,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'
import { useToast } from 'primevue/usetoast'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const error = ref(null)
    const loading = ref(false)
    const toast = useToast()

    const isAuthenticated = computed(() => auth.currentUser)
    const userRole = computed(() => auth.currentUser?.role || 'guest')

    async function register({ email, password, name, role = 'customer' }) {
        try {
            loading.value = true
            const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password)

            await updateProfile(authUser, {
                displayName: name // Задаем имя пользователя
            });

            console.log("User registered with display name:", authUser.displayName);

            await setDoc(doc(db, 'users', authUser.uid), {
                name,
                email,
                role,
                id: authUser.uid
            })

            user.value = authUser
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Реєстрація успішна',
                life: 3000
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
        } finally {
            loading.value = false
        }
    }

    async function login({ email, password, remember = false }) {
        try {
            loading.value = true
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            )
            const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)

            user.value = authUser

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Успішний вхід',
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
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await signOut(auth)
            user.value = null
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Успішно вийшли',
                life: 5000
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

    return {
        user,
        error,
        loading,
        isAuthenticated,
        userRole,
        register,
        login,
        logout,
        resetPassword
    }
})
