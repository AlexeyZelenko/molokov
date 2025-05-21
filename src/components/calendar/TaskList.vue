<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCalendarStore } from '@/store/calendarStore';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Editor from 'primevue/editor';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { format, parseISO, isAfter, isSameDay } from 'date-fns';
import { uk } from 'date-fns/locale';

const calendarStore = useCalendarStore();
const confirm = useConfirm();
const toast = useToast();

// Диалог создания/редактирования задачи
const showTaskDialog = ref(false);
const taskDialogMode = ref('add');
const selectedTask = ref(null);

// Форма задачи
const taskForm = ref({
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    category: 'work',
    relatedTo: null
});

// Опции для выпадающих списков
const priorities = ref([
    { name: 'Висока', value: 'high' },
    { name: 'Середня', value: 'medium' },
    { name: 'Низька', value: 'low' }
]);

const categories = ref([
    { name: 'Робота', value: 'work' },
    { name: 'Показ нерухомості', value: 'showing' },
    { name: 'Зустріч з клієнтом', value: 'client' },
    { name: 'Дзвінок', value: 'call' },
    { name: 'Документи', value: 'documents' },
    { name: 'Особисте', value: 'personal' }
]);

// Вычисляемые свойства
const pendingTasks = computed(() => calendarStore.getPendingTasks);
const completedTasks = computed(() => calendarStore.getCompletedTasks);
const completionPercentage = computed(() => {
    const total = pendingTasks.value.length + completedTasks.value.length;
    if (total === 0) return 0;
    return Math.round((completedTasks.value.length / total) * 100);
});

// Методы
const openAddTaskDialog = () => {
    taskForm.value = {
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'medium',
        category: 'work',
        relatedTo: null
    };
    taskDialogMode.value = 'add';
    showTaskDialog.value = true;
};

const openEditTaskDialog = (task) => {
    selectedTask.value = task;
    taskForm.value = {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? parseISO(task.dueDate) : new Date(),
        priority: task.priority || 'medium',
        category: task.category || 'work',
        relatedTo: task.relatedTo || null
    };
    taskDialogMode.value = 'edit';
    showTaskDialog.value = true;
};

const saveTask = async () => {
    if (!taskForm.value.title.trim()) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Назва задачі обов\'язкова',
            life: 3000
        });
        return;
    }
    
    const taskData = {
        title: taskForm.value.title.trim(),
        description: taskForm.value.description,
        dueDate: taskForm.value.dueDate.toISOString(),
        priority: taskForm.value.priority,
        category: taskForm.value.category,
        relatedTo: taskForm.value.relatedTo
    };
    
    try {
        if (taskDialogMode.value === 'add') {
            await calendarStore.addTask(taskData);
            toast.add({
                severity: 'success',
                summary: 'Успіх',
                detail: 'Задачу додано',
                life: 3000
            });
        } else {
            await calendarStore.updateTask(selectedTask.value.id, taskData);
            toast.add({
                severity: 'success',
                summary: 'Успіх',
                detail: 'Задачу оновлено',
                life: 3000
            });
        }
        
        showTaskDialog.value = false;
        selectedTask.value = null;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося зберегти задачу',
            life: 3000
        });
    }
};

const confirmDeleteTask = (task) => {
    confirm.require({
        message: 'Ви впевнені, що хочете видалити цю задачу?',
        header: 'Підтвердження видалення',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteTask(task),
        reject: () => {}
    });
};

const deleteTask = async (task) => {
    try {
        await calendarStore.deleteTask(task.id);
        toast.add({
            severity: 'success',
            summary: 'Успіх',
            detail: 'Задачу видалено',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося видалити задачу',
            life: 3000
        });
    }
};

const toggleTaskCompletion = async (task) => {
    try {
        await calendarStore.toggleTaskCompletion(task.id);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося оновити статус задачі',
            life: 3000
        });
    }
};

const getPriorityClass = (priority) => {
    switch (priority) {
        case 'high': return 'task-priority-high';
        case 'medium': return 'task-priority-medium';
        case 'low': return 'task-priority-low';
        default: return 'task-priority-medium';
    }
};

const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'd MMMM', { locale: uk });
};

const isDueToday = (dateString) => {
    if (!dateString) return false;
    return isSameDay(parseISO(dateString), new Date());
};

const isOverdue = (dateString) => {
    if (!dateString) return false;
    return isAfter(new Date(), parseISO(dateString)) && !isDueToday(dateString);
};

// Хуки жизненного цикла
onMounted(async () => {
    await calendarStore.fetchTasks();
});
</script>

<template>
    <div class="task-list-container">
        <ConfirmDialog />
        
        <div class="task-header mb-4">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Мої задачі</h2>
                <Button label="Нова задача" icon="pi pi-plus" @click="openAddTaskDialog" />
            </div>
            
            <div class="progress-bar mt-3">
                <div class="flex justify-between items-center mb-1">
                    <span>Прогрес: {{ completionPercentage }}%</span>
                    <span>{{ completedTasks.length }} / {{ pendingTasks.length + completedTasks.length }}</span>
                </div>
                <ProgressBar :value="completionPercentage" />
            </div>
        </div>
        
        <div class="pending-tasks mb-6">
            <h3 class="text-lg font-semibold mb-3">Активні задачі</h3>
            
            <div v-if="pendingTasks.length === 0" class="empty-message p-3 bg-gray-50 rounded text-center">
                У вас немає активних задач
            </div>
            
            <div v-else class="task-items">
                <div v-for="task in pendingTasks" :key="task.id" class="task-item bg-white rounded-lg p-3 mb-2 shadow-sm border-l-4"
                     :class="[getPriorityClass(task.priority)]">
                    <div class="flex items-start">
                        <Checkbox v-model="task.completed" :binary="true" class="mt-1" @change="toggleTaskCompletion(task)" />
                        
                        <div class="ml-3 flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="task-title font-medium">{{ task.title }}</div>
                                    <div class="task-category text-xs text-gray-500 mt-1">{{ task.category }}</div>
                                </div>
                                
                                <div class="task-actions flex">
                                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="openEditTaskDialog(task)" />
                                    <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDeleteTask(task)" />
                                </div>
                            </div>
                            
                            <div class="task-due-date mt-2" 
                                :class="{ 'text-red-500': isOverdue(task.dueDate), 'text-orange-500': isDueToday(task.dueDate) }">
                                <i class="pi pi-calendar mr-1"></i>
                                <span v-if="isDueToday(task.dueDate)" class="text-sm">Сьогодні</span>
                                <span v-else-if="isOverdue(task.dueDate)" class="text-sm">Прострочено: {{ getFormattedDate(task.dueDate) }}</span>
                                <span v-else class="text-sm">{{ getFormattedDate(task.dueDate) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="completed-tasks" v-if="completedTasks.length > 0">
            <h3 class="text-lg font-semibold mb-3">Завершені задачі</h3>
            
            <div class="task-items">
                <div v-for="task in completedTasks" :key="task.id" class="task-item bg-white rounded-lg p-3 mb-2 shadow-sm border-l-4 opacity-70">
                    <div class="flex items-start">
                        <Checkbox v-model="task.completed" :binary="true" class="mt-1" @change="toggleTaskCompletion(task)" />
                        
                        <div class="ml-3 flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="task-title font-medium line-through">{{ task.title }}</div>
                                    <div class="task-category text-xs text-gray-500 mt-1">{{ task.category }}</div>
                                </div>
                                
                                <div class="task-actions flex">
                                    <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDeleteTask(task)" />
                                </div>
                            </div>
                            
                            <div class="task-due-date mt-2 text-sm text-gray-500">
                                <i class="pi pi-calendar mr-1"></i>
                                <span>{{ getFormattedDate(task.dueDate) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Диалог создания/редактирования задачи -->
        <Dialog v-model:visible="showTaskDialog" :header="taskDialogMode === 'add' ? 'Додати задачу' : 'Редагувати задачу'" 
            :style="{ width: '500px' }" :modal="true">
            <div class="p-fluid">
                <div class="field mb-4">
                    <label for="title">Назва задачі</label>
                    <InputText id="title" v-model="taskForm.title" required />
                </div>
                
                <div class="field-row grid mb-4">
                    <div class="col-6">
                        <label for="dueDate">Дата виконання</label>
                        <Calendar id="dueDate" v-model="taskForm.dueDate" showIcon />
                    </div>
                    <div class="col-6">
                        <label for="priority">Приоритет</label>
                        <Dropdown id="priority" v-model="taskForm.priority" :options="priorities" optionLabel="name" optionValue="value" />
                    </div>
                </div>
                
                <div class="field mb-4">
                    <label for="category">Категорія</label>
                    <Dropdown id="category" v-model="taskForm.category" :options="categories" optionLabel="name" optionValue="value" />
                </div>
                
                <div class="field mb-4">
                    <label for="description">Опис</label>
                    <Editor v-model="taskForm.description" editorStyle="height: 150px" />
                </div>
            </div>
            
            <template #footer>
                <Button label="Відміна" icon="pi pi-times" @click="showTaskDialog = false" class="p-button-text" />
                <Button v-if="taskDialogMode === 'edit'" label="Видалити" icon="pi pi-trash" @click="confirmDeleteTask(selectedTask)" class="p-button-danger p-button-text" />
                <Button label="Зберегти" icon="pi pi-check" @click="saveTask" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.task-list-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.task-priority-high {
    border-left-color: #ef4444;
}

.task-priority-medium {
    border-left-color: #f59e0b;
}

.task-priority-low {
    border-left-color: #10b981;
}

.task-item {
    transition: all 0.2s ease;
}

.task-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.1);
}
</style> 