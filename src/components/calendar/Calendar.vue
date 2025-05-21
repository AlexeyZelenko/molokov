<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCalendarStore } from '@/store/calendarStore';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isToday, isWithinInterval, parseISO } from 'date-fns';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Editor from 'primevue/editor';
import Tag from 'primevue/tag';
import ColorPicker from 'primevue/colorpicker';
import { uk } from 'date-fns/locale';

const calendarStore = useCalendarStore();
const currentDate = ref(new Date());
const selectedDate = ref(null);
const calendarDays = ref([]);
const selectedEvent = ref(null);
const showEventDialog = ref(false);
const eventDialogMode = ref('add');

// Форма события
const eventForm = ref({
    title: '',
    description: '',
    start: null,
    end: null,
    allDay: false,
    color: '#4338ca',
    type: 'appointment'
});

// Типы событий
const eventTypes = ref([
    { name: 'Встреча', value: 'appointment' },
    { name: 'Показ', value: 'showing' },
    { name: 'Звонок', value: 'call' },
    { name: 'Напоминание', value: 'reminder' },
    { name: 'Встреча с клиентом', value: 'client' }
]);

// Вычисляемые свойства
const currentMonthLabel = computed(() => {
    return format(currentDate.value, 'LLLL yyyy', { locale: uk });
});

const daysOfWeek = computed(() => {
    return ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
});

// Методы
const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate.value);
    const monthEnd = endOfMonth(currentDate.value);
    const startDate = monthStart;
    const endDate = monthEnd;

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Получаем первый день недели (0 - воскресенье, 1 - понедельник, и т.д.)
    const firstDayOfMonth = getDay(monthStart);

    // Добавляем пустые ячейки перед первым днём месяца
    const previousMonthDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        previousMonthDays.push(null);
    }

    calendarDays.value = [...previousMonthDays, ...days];
};

const goToNextMonth = () => {
    currentDate.value = addMonths(currentDate.value, 1);
};

const goToPreviousMonth = () => {
    currentDate.value = subMonths(currentDate.value, 1);
};

const goToToday = () => {
    currentDate.value = new Date();
};

const getEventsForDay = (day) => {
    if (!day) return [];
    return calendarStore.events.filter((event) => {
        const eventStart = parseISO(event.start);
        const eventEnd = event.end ? parseISO(event.end) : eventStart;

        // Проверяем, находится ли день в интервале события
        return isWithinInterval(day, {
            start: new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()),
            end: new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate())
        });
    });
};

const openAddEventDialog = (day) => {
    selectedDate.value = day;
    eventForm.value = {
        title: '',
        description: '',
        start: new Date(day),
        end: addDays(new Date(day), 1),
        allDay: false,
        color: '#4338ca',
        type: 'appointment'
    };
    eventDialogMode.value = 'add';
    showEventDialog.value = true;
};

const openEditEventDialog = (event) => {
    selectedEvent.value = event;
    eventForm.value = {
        title: event.title,
        description: event.description || '',
        start: parseISO(event.start),
        end: event.end ? parseISO(event.end) : null,
        allDay: event.allDay || false,
        color: event.color || '#4338ca',
        type: event.type || 'appointment'
    };
    eventDialogMode.value = 'edit';
    showEventDialog.value = true;
};

const saveEvent = async () => {
    if (!eventForm.value.title.trim()) {
        // Показать ошибку
        return;
    }

    const eventData = {
        title: eventForm.value.title.trim(),
        description: eventForm.value.description,
        start: eventForm.value.start.toISOString(),
        end: eventForm.value.end ? eventForm.value.end.toISOString() : null,
        allDay: eventForm.value.allDay,
        color: eventForm.value.color,
        type: eventForm.value.type
    };

    if (eventDialogMode.value === 'add') {
        await calendarStore.addEvent(eventData);
    } else {
        await calendarStore.updateEvent(selectedEvent.value.id, eventData);
    }

    showEventDialog.value = false;
    selectedEvent.value = null;
};

const deleteEvent = async () => {
    if (selectedEvent.value) {
        await calendarStore.deleteEvent(selectedEvent.value.id);
        showEventDialog.value = false;
        selectedEvent.value = null;
    }
};

const getTagSeverity = (type) => {
    switch (type) {
        case 'appointment':
            return 'info';
        case 'showing':
            return 'success';
        case 'call':
            return 'warning';
        case 'reminder':
            return 'secondary';
        case 'client':
            return 'primary';
        default:
            return 'info';
    }
};

// Наблюдение за изменением даты
watch(currentDate, () => {
    generateCalendarDays();
});

// Хуки жизненного цикла
onMounted(async () => {
    await calendarStore.fetchEvents();
    generateCalendarDays();
});
</script>

<template>
    <div class="calendar-container">
        <div class="calendar-header p-d-flex p-jc-between p-ai-center mb-4">
            <div class="calendar-title">
                <h2 class="text-2xl font-bold">{{ currentMonthLabel }}</h2>
            </div>
            <div class="calendar-nav">
                <Button icon="pi pi-chevron-left" @click="goToPreviousMonth" class="p-button-rounded p-button-text" />
                <Button label="Сьогодні" @click="goToToday" class="p-button-rounded" />
                <Button icon="pi pi-chevron-right" @click="goToNextMonth" class="p-button-rounded p-button-text" />
            </div>
        </div>

        <div class="calendar-grid">
            <!-- Дни недели -->
            <div class="grid grid-cols-7 mb-2">
                <div v-for="(day, index) in daysOfWeek" :key="index" class="text-center py-2 font-semibold text-gray-600">
                    {{ day }}
                </div>
            </div>

            <!-- Календарные дни -->
            <div class="grid grid-cols-7 gap-1">
                <div
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    class="calendar-day p-2 min-h-[100px] border border-gray-200 rounded relative"
                    :class="{
                        'bg-gray-100': !day,
                        today: day && isToday(day),
                        'cursor-pointer': day
                    }"
                    @click="day && openAddEventDialog(day)"
                >
                    <div v-if="day" class="day-header flex justify-between items-center">
                        <span class="day-number" :class="{ 'text-blue-600 font-bold': isToday(day) }">
                            {{ format(day, 'd') }}
                        </span>
                    </div>

                    <!-- События дня -->
                    <div v-if="day" class="day-events mt-1">
                        <div v-for="event in getEventsForDay(day)" :key="event.id" class="event p-1 rounded mb-1 text-xs truncate cursor-pointer" :style="{ backgroundColor: event.color, color: '#fff' }" @click.stop="openEditEventDialog(event)">
                            {{ event.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Диалог создания/редактирования события -->
        <Dialog v-model:visible="showEventDialog" :header="eventDialogMode === 'add' ? 'Додати подію' : 'Редагувати подію'" :style="{ width: '500px' }" :modal="true">
            <div class="p-fluid">
                <div class="field mb-4">
                    <label for="title">Назва події</label>
                    <InputText id="title" v-model="eventForm.title" required />
                </div>

                <div class="field mb-4">
                    <label for="type">Тип події</label>
                    <Dropdown id="type" v-model="eventForm.type" :options="eventTypes" optionLabel="name" optionValue="value" placeholder="Виберіть тип" />
                </div>

                <div class="field mb-4">
                    <label>Кольор</label>
                    <ColorPicker v-model="eventForm.color" />
                </div>

                <div class="field-row grid mb-4">
                    <div class="col-6">
                        <label for="start">Початок</label>
                        <Calendar id="start" v-model="eventForm.start" showTime hourFormat="24" />
                    </div>
                    <div class="col-6">
                        <label for="end">Кінець</label>
                        <Calendar id="end" v-model="eventForm.end" showTime hourFormat="24" />
                    </div>
                </div>

                <div class="field mb-4">
                    <label for="description">Опис</label>
                    <Editor v-model="eventForm.description" editorStyle="height: 150px" />
                </div>
            </div>

            <template #footer>
                <Button label="Відміна" icon="pi pi-times" @click="showEventDialog = false" class="p-button-text" />
                <Button v-if="eventDialogMode === 'edit'" label="Видалити" icon="pi pi-trash" @click="deleteEvent" class="p-button-danger p-button-text" />
                <Button label="Зберегти" icon="pi pi-check" @click="saveEvent" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.calendar-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.today {
    background-color: rgba(66, 153, 225, 0.1);
    border-color: rgba(66, 153, 225, 0.3);
}

.calendar-day:hover {
    background-color: rgba(66, 153, 225, 0.05);
}

.day-number {
    display: inline-block;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 50%;
}

.today .day-number {
    background-color: #3f83f8;
    color: white !important;
}
</style>
