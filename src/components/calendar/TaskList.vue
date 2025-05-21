<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
import { format, parseISO, isAfter, isSameDay, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';

// Подключение хранилища и сервисов
const calendarStore = useCalendarStore();
const confirm = useConfirm();
const toast = useToast();

// Состояние компонента
const isLoading = ref(false);
const showTaskDialog = ref(false);
const taskDialogMode = ref('add');
const selectedTask = ref(null);
const filterType = ref('all'); // Фильтр задач: all, today, upcoming, overdue

// Форма задачи
const taskForm = ref({
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    category: 'work',
    relatedTo: null
});

// Валидация формы
const formErrors = ref({
    title: ''
});

// Опции для выпадающих списков
const priorities = [
    { name: 'Висока', value: 'high' },
    { name: 'Середня', value: 'medium' },
    { name: 'Низька', value: 'low' }
];

const categories = [
    { name: 'Робота', value: 'work' },
    { name: 'Показ нерухомості', value: 'showing' },
    { name: 'Зустріч з клієнтом', value: 'client' },
    { name: 'Дзвінок', value: 'call' },
    { name: 'Документи', value: 'documents' },
    { name: 'Особисте', value: 'personal' }
];

// Фильтры задач
const filterOptions = [
    { name: 'Всі', value: 'all' },
    { name: 'На сьогодні', value: 'today' },
    { name: 'Найближчі', value: 'upcoming' },
    { name: 'Прострочені', value: 'overdue' }
];

const confirmClearCompleted = () => {
    confirm.require({
        message: 'Ви впевнені, що хочете видалити всі завершені задачі?',
        header: 'Підтвердження очищення',
        icon: 'pi pi-exclamation-triangle',
        accept: () => clearCompletedTasks(), // Call a method to clear tasks
        reject: () => {}
    });
};

const clearCompletedTasks = async () => {
    isLoading.value = true;
    try {
        await calendarStore.clearCompletedTasks(); // Assuming you have this method in your store
        showSuccessToast('Завершені задачі очищено');
    } catch (error) {
        console.error('Помилка очищення завершених задач:', error);
        showErrorToast('Не вдалося очистити завершені задачі');
    } finally {
        isLoading.value = false;
    }
};

// Вычисляемые свойства с мемоизацией
const pendingTasks = computed(() => {
    const tasks = calendarStore.getPendingTasks;

    switch (filterType.value) {
        case 'today':
            return tasks.filter((task) => isDueToday(task.dueDate));
        case 'upcoming':
            return tasks.filter((task) => {
                const dueDate = parseISO(task.dueDate);
                const tomorrow = addDays(new Date(), 1);
                const nextWeek = addDays(new Date(), 7);
                return isAfter(dueDate, tomorrow) && !isAfter(dueDate, nextWeek);
            });
        case 'overdue':
            return tasks.filter((task) => isOverdue(task.dueDate));
        default:
            return tasks;
    }
});

const completedTasks = computed(() => calendarStore.getCompletedTasks);

const completionPercentage = computed(() => {
    const total = pendingTasks.value.length + completedTasks.value.length;
    if (total === 0) return 0;
    return Math.round((completedTasks.value.length / total) * 100);
});

// Наблюдатель для валидации формы
watch(
    () => taskForm.value.title,
    (newTitle) => {
        if (newTitle.trim()) {
            formErrors.value.title = '';
        }
    }
);

// Методы
const openAddTaskDialog = () => {
    // Сброс формы на дефолтные значения
    resetTaskForm();
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
    formErrors.value = { title: '' };
    taskDialogMode.value = 'edit';
    showTaskDialog.value = true;
};

const resetTaskForm = () => {
    taskForm.value = {
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'medium',
        category: 'work',
        relatedTo: null
    };
    formErrors.value = { title: '' };
};

const validateForm = () => {
    let isValid = true;

    if (!taskForm.value.title.trim()) {
        formErrors.value.title = "Назва задачі обов'язкова";
        isValid = false;
    }

    return isValid;
};

const saveTask = async () => {
    if (!validateForm()) {
        showErrorToast('Перевірте правильність заповнення форми');
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

    isLoading.value = true;

    try {
        if (taskDialogMode.value === 'add') {
            await calendarStore.addTask(taskData);
            showSuccessToast('Задачу додано');
        } else {
            await calendarStore.updateTask(selectedTask.value.id, taskData);
            showSuccessToast('Задачу оновлено');
        }

        showTaskDialog.value = false;
        selectedTask.value = null;
    } catch (error) {
        console.error('Помилка збереження задачі:', error);
        showErrorToast('Не вдалося зберегти задачу');
    } finally {
        isLoading.value = false;
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
    isLoading.value = true;

    try {
        await calendarStore.deleteTask(task.id);
        showSuccessToast('Задачу видалено');

        if (showTaskDialog.value && selectedTask.value?.id === task.id) {
            showTaskDialog.value = false;
        }
    } catch (error) {
        console.error('Помилка видалення задачі:', error);
        showErrorToast('Не вдалося видалити задачу');
    } finally {
        isLoading.value = false;
    }
};

const toggleTaskCompletion = async (task) => {
    console.log('[COMPONENT] toggleTaskCompletion called with task:', task);
    console.log('[COMPONENT] Task ID:', task.id);
    console.log('[COMPONENT] Current task completed status:', task.completed);

    const originalStatus = task.completed;

    try {
        // Явно передаем ID задачи в виде строки для согласованности типов
        console.log('[COMPONENT] Calling store method with ID:', task.id);
        await calendarStore.toggleTaskCompletion(task.id);
        console.log('[COMPONENT] Store method completed successfully');
    } catch (error) {
        console.error('[COMPONENT] Error occurred:', error);
        showErrorToast('Не вдалося оновити статус задачі');

        // Отмена изменения интерфейса: восстановление предыдущего состояния
        console.log('[COMPONENT] Reverting UI state to:', originalStatus);
        task.completed = originalStatus;
    }
};

// Утилиты и хелперы
const getPriorityClass = (priority) => {
    switch (priority) {
        case 'high':
            return 'task-priority-high';
        case 'medium':
            return 'task-priority-medium';
        case 'low':
            return 'task-priority-low';
        default:
            return 'task-priority-medium';
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

const getCategoryIcon = (category) => {
    switch (category) {
        case 'work':
            return 'pi pi-briefcase';
        case 'showing':
            return 'pi pi-home';
        case 'client':
            return 'pi pi-users';
        case 'call':
            return 'pi pi-phone';
        case 'documents':
            return 'pi pi-file';
        case 'personal':
            return 'pi pi-user';
        default:
            return 'pi pi-tag';
    }
};

// Уведомления
const showSuccessToast = (message) => {
    toast.add({
        severity: 'success',
        summary: 'Успіх',
        detail: message,
        life: 3000
    });
};

const showErrorToast = (message) => {
    toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: message,
        life: 3000
    });
};

// Инициализация компонента
onMounted(async () => {
    isLoading.value = true;

    try {
        await calendarStore.fetchTasks();
    } catch (error) {
        console.error('Помилка завантаження задач:', error);
        showErrorToast('Не вдалося завантажити задачі');
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="task-list-container">
        <!-- Система уведомлений и подтверждений -->
        <ConfirmDialog />

        <div class="task-header mb-4">
            <div class="flex justify-between items-center flex-wrap gap-2">
                <h2 class="text-2xl font-bold">Мої задачі</h2>
                <Button label="Нова задача" icon="pi pi-plus" @click="openAddTaskDialog" />
            </div>

            <div class="task-filters mt-4 mb-3">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-filter"></i>
                    </span>
                    <Dropdown v-model="filterType" :options="filterOptions" optionLabel="name" optionValue="value" placeholder="Фільтр задач" class="w-full" />
                </div>
            </div>

            <div class="progress-bar mt-3">
                <div class="flex justify-between items-center mb-1">
                    <span>Прогрес: {{ completionPercentage }}%</span>
                    <span>{{ completedTasks.length }} / {{ pendingTasks.length + completedTasks.length }}</span>
                </div>
                <ProgressBar :value="completionPercentage" />
            </div>
        </div>

        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading-indicator flex justify-center my-4">
            <i class="pi pi-spin pi-spinner text-3xl"></i>
        </div>

        <!-- Список активных задач -->
        <div v-else class="pending-tasks mb-6">
            <h3 class="text-lg font-semibold mb-3">
                Активні задачі
                <span class="text-sm font-normal ml-2 text-gray-500">({{ pendingTasks.length }})</span>
            </h3>

            <div v-if="pendingTasks.length === 0" class="empty-message p-3 bg-gray-50 rounded text-center">
                <p v-if="filterType === 'all'">У вас немає активних задач</p>
                <p v-else>Немає задач, що відповідають обраному фільтру</p>
            </div>

            <div v-else class="task-items">
                <div v-for="task in pendingTasks" :key="task.id" class="task-item bg-white rounded-lg p-3 mb-2 shadow-sm border-l-4" :class="[getPriorityClass(task.priority)]">
                    <div class="flex items-start">
                        <Checkbox v-model="task.completed" :binary="true" class="mt-1"
                                  @change="() => { console.log('Checkbox clicked for task ID:', task.id); toggleTaskCompletion(task); }" />

                        <div class="ml-3 flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="task-title font-medium">{{ task.title }}</div>
                                    <div class="task-category text-xs text-gray-500 mt-1">
                                        <i :class="getCategoryIcon(task.category)" class="mr-1"></i>
                                        {{ categories.find((c) => c.value === task.category)?.name || task.category }}
                                    </div>
                                </div>

                                <div class="task-actions flex">
                                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="openEditTaskDialog(task)" />
                                    <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDeleteTask(task)" />
                                </div>
                            </div>

                            <div class="task-description mt-2 text-sm text-gray-600" v-if="task.description" v-html="task.description"></div>

                            <div class="task-due-date mt-2" :class="{ 'text-red-500': isOverdue(task.dueDate), 'text-orange-500': isDueToday(task.dueDate) }">
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

        <!-- Список завершенных задач -->
        <div class="completed-tasks" v-if="completedTasks.length > 0 && !isLoading">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold">
                    Завершені задачі
                    <span class="text-sm font-normal ml-2 text-gray-500">({{ completedTasks.length }})</span>
                </h3>
                <Button v-if="completedTasks.length > 0" icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" label="Очистити" @click="confirmClearCompleted" />
            </div>

            <div class="task-items">
                <div v-for="task in completedTasks.slice(0, 5)" :key="task.id" class="task-item bg-white rounded-lg p-3 mb-2 shadow-sm border-l-4 opacity-70">
                    <div class="flex items-start">
                        <Checkbox v-model="task.completed" :binary="true" class="mt-1"
                                  @change="() => { console.log('Completed task checkbox clicked for task ID:', task.id); toggleTaskCompletion(task); }" />

                        <div class="ml-3 flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="task-title font-medium line-through">{{ task.title }}</div>
                                    <div class="task-category text-xs text-gray-500 mt-1">
                                        <i :class="getCategoryIcon(task.category)" class="mr-1"></i>
                                        {{ categories.find((c) => c.value === task.category)?.name || task.category }}
                                    </div>
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

                <div v-if="completedTasks.length > 5" class="show-more text-center mt-2">
                    <Button class="p-button-text p-button-sm" label="Показати більше" icon="pi pi-chevron-down" />
                </div>
            </div>
        </div>

        <!-- Диалог создания/редактирования задачи -->
        <Dialog v-model:visible="showTaskDialog" :header="taskDialogMode === 'add' ? 'Додати задачу' : 'Редагувати задачу'" :style="{ width: '500px' }" :modal="true" :closable="!isLoading" :closeOnEscape="!isLoading">
            <div class="p-fluid">
                <div class="field mb-4">
                    <label for="title" class="font-medium">Назва задачі*</label>
                    <InputText id="title" v-model="taskForm.title" :class="{ 'p-invalid': formErrors.title }" />
                    <small v-if="formErrors.title" class="p-error">{{ formErrors.title }}</small>
                </div>

                <div class="field-row grid mb-4">
                    <div class="col-12 md:col-6">
                        <label for="dueDate" class="font-medium">Дата виконання</label>
                        <Calendar id="dueDate" v-model="taskForm.dueDate" showIcon showButtonBar />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="priority" class="font-medium">Приоритет</label>
                        <Dropdown id="priority" v-model="taskForm.priority" :options="priorities" optionLabel="name" optionValue="value" class="w-full" />
                    </div>
                </div>

                <div class="field mb-4">
                    <label for="category" class="font-medium">Категорія</label>
                    <Dropdown id="category" v-model="taskForm.category" :options="categories" optionLabel="name" optionValue="value" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="description" class="font-medium">Опис</label>
                    <Editor v-model="taskForm.description" editorStyle="height: 150px" />
                </div>
            </div>

            <template #footer>
                <Button label="Відміна" icon="pi pi-times" @click="showTaskDialog = false" class="p-button-text" :disabled="isLoading" />
                <Button v-if="taskDialogMode === 'edit'" label="Видалити" icon="pi pi-trash" @click="confirmDeleteTask(selectedTask)" class="p-button-danger p-button-text" :disabled="isLoading" />
                <Button label="Зберегти" icon="pi pi-check" @click="saveTask" :loading="isLoading" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.task-list-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

/* Адаптивные стили для мобильных устройств */
@media (max-width: 640px) {
    .task-header {
        flex-direction: column;
        align-items: stretch;
    }

    .task-actions {
        margin-top: 0.5rem;
    }

    .task-item {
        padding: 0.75rem;
    }
}

/* Улучшенная доступность */
:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
}

/* Анимация для индикатора загрузки */
.loading-indicator {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
