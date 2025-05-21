<script setup>
import { ref } from 'vue';
import Calendar from '@/components/calendar/Calendar.vue';
import TaskList from '@/components/calendar/TaskList.vue';
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button';
import { useCalendarStore } from '@/store/calendarStore';
import { exportToICal, syncWithGoogleCalendar } from '@/services/calendarService';
import { useToast } from 'primevue/usetoast';

const activeTabIndex = ref(0);
const calendarStore = useCalendarStore();
const toast = useToast();
const isSyncing = ref(false);
const isExporting = ref(false);

const tabs = ref([
    { label: 'Календар', icon: 'pi pi-calendar' },
    { label: 'Задачі', icon: 'pi pi-check-square' }
]);

const handleTabChange = (e) => {
    activeTabIndex.value = e.index;
};

const handleSyncWithGoogle = async () => {
    isSyncing.value = true;
    try {
        await syncWithGoogleCalendar();
        toast.add({
            severity: 'success',
            summary: 'Синхронізовано',
            detail: 'Календар успішно синхронізовано з Google',
            life: 3000
        });
    } catch (error) {
        console.error('Error syncing with Google:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося синхронізувати з Google Calendar',
            life: 3000
        });
    } finally {
        isSyncing.value = false;
    }
};

const handleExport = async () => {
    isExporting.value = true;
    try {
        // Экспортируем только события календаря (без задач)
        exportToICal(calendarStore.events);
        toast.add({
            severity: 'success',
            summary: 'Експорт',
            detail: 'Календар успішно експортовано',
            life: 3000
        });
    } catch (error) {
        console.error('Error exporting calendar:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося експортувати календар',
            life: 3000
        });
    } finally {
        isExporting.value = false;
    }
};
</script>

<template>
    <div class="calendar-dashboard">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold">Планування роботи</h1>
            <div class="buttons">
                <Button label="Синхронізувати з Google" icon="pi pi-google" class="p-button-outlined mr-2" 
                    @click="handleSyncWithGoogle" :loading="isSyncing" />
                <Button label="Експортувати iCal" icon="pi pi-download" class="p-button-outlined" 
                    @click="handleExport" :loading="isExporting" />
            </div>
        </div>
        
        <div class="mb-4">
            <TabMenu :model="tabs" :activeIndex="activeTabIndex" @tab-change="handleTabChange" />
        </div>
        
        <div class="tab-content">
            <transition name="fade" mode="out-in">
                <div v-if="activeTabIndex === 0" key="calendar" class="calendar-container">
                    <Calendar />
                </div>
                <div v-else-if="activeTabIndex === 1" key="tasks" class="tasks-container">
                    <TaskList />
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
.calendar-dashboard {
    padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style> 