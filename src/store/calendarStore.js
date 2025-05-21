import { defineStore } from 'pinia';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuthStore } from './authFirebase';

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        events: [],
        tasks: [],
        loading: false,
        error: null
    }),
    
    getters: {
        getEventsByDate: (state) => (date) => {
            const selectedDate = new Date(date);
            return state.events.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.getDate() === selectedDate.getDate() &&
                       eventDate.getMonth() === selectedDate.getMonth() &&
                       eventDate.getFullYear() === selectedDate.getFullYear();
            });
        },
        
        getPendingTasks: (state) => {
            return state.tasks.filter(task => !task.completed);
        },
        
        getCompletedTasks: (state) => {
            return state.tasks.filter(task => task.completed);
        }
    },
    
    actions: {
        // События календаря
        async fetchEvents() {
            const authStore = useAuthStore();
            if (!authStore.user) return;
            
            this.loading = true;
            try {
                const q = query(
                    collection(db, 'calendarEvents'),
                    where('userId', '==', authStore.user.uid),
                    orderBy('start')
                );
                const querySnapshot = await getDocs(q);
                this.events = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                this.error = null;
            } catch (error) {
                console.error('Error fetching events:', error);
                this.error = 'Помилка завантаження подій';
            } finally {
                this.loading = false;
            }
        },
        
        async addEvent(event) {
            const authStore = useAuthStore();
            if (!authStore.user) return;
            
            this.loading = true;
            try {
                const eventWithUser = {
                    ...event,
                    userId: authStore.user.uid,
                    createdAt: new Date().toISOString()
                };
                const docRef = await addDoc(collection(db, 'calendarEvents'), eventWithUser);
                this.events.push({
                    id: docRef.id,
                    ...eventWithUser
                });
                this.error = null;
                return docRef.id;
            } catch (error) {
                console.error('Error adding event:', error);
                this.error = 'Помилка додавання події';
                return null;
            } finally {
                this.loading = false;
            }
        },
        
        async updateEvent(id, updatedEvent) {
            this.loading = true;
            try {
                const eventRef = doc(db, 'calendarEvents', id);
                await updateDoc(eventRef, updatedEvent);
                const index = this.events.findIndex(event => event.id === id);
                if (index !== -1) {
                    this.events[index] = { ...this.events[index], ...updatedEvent };
                }
                this.error = null;
            } catch (error) {
                console.error('Error updating event:', error);
                this.error = 'Помилка оновлення події';
            } finally {
                this.loading = false;
            }
        },
        
        async deleteEvent(id) {
            this.loading = true;
            try {
                const eventRef = doc(db, 'calendarEvents', id);
                await deleteDoc(eventRef);
                this.events = this.events.filter(event => event.id !== id);
                this.error = null;
            } catch (error) {
                console.error('Error deleting event:', error);
                this.error = 'Помилка видалення події';
            } finally {
                this.loading = false;
            }
        },
        
        // Задачи
        async fetchTasks() {
            const authStore = useAuthStore();
            if (!authStore.user) return;
            
            this.loading = true;
            try {
                const q = query(
                    collection(db, 'tasks'),
                    where('userId', '==', authStore.user.uid),
                    orderBy('dueDate')
                );
                const querySnapshot = await getDocs(q);
                this.tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                this.error = null;
            } catch (error) {
                console.error('Error fetching tasks:', error);
                this.error = 'Помилка завантаження задач';
            } finally {
                this.loading = false;
            }
        },
        
        async addTask(task) {
            const authStore = useAuthStore();
            if (!authStore.user) return;
            
            this.loading = true;
            try {
                const taskWithUser = {
                    ...task,
                    userId: authStore.user.uid,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                const docRef = await addDoc(collection(db, 'tasks'), taskWithUser);
                this.tasks.push({
                    id: docRef.id,
                    ...taskWithUser
                });
                this.error = null;
                return docRef.id;
            } catch (error) {
                console.error('Error adding task:', error);
                this.error = 'Помилка додавання задачі';
                return null;
            } finally {
                this.loading = false;
            }
        },
        
        async updateTask(id, updatedTask) {
            this.loading = true;
            try {
                const taskRef = doc(db, 'tasks', id);
                await updateDoc(taskRef, updatedTask);
                const index = this.tasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    this.tasks[index] = { ...this.tasks[index], ...updatedTask };
                }
                this.error = null;
            } catch (error) {
                console.error('Error updating task:', error);
                this.error = 'Помилка оновлення задачі';
            } finally {
                this.loading = false;
            }
        },
        
        async toggleTaskCompletion(id) {
            const task = this.tasks.find(task => task.id === id);
            if (task) {
                await this.updateTask(id, { completed: !task.completed });
            }
        },
        
        async deleteTask(id) {
            this.loading = true;
            try {
                const taskRef = doc(db, 'tasks', id);
                await deleteDoc(taskRef);
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.error = null;
            } catch (error) {
                console.error('Error deleting task:', error);
                this.error = 'Помилка видалення задачі';
            } finally {
                this.loading = false;
            }
        }
    }
}); 