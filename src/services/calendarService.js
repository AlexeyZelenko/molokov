import axios from 'axios';
import { useAuthStore } from '@/store/authFirebase';
import { useCalendarStore } from '@/store/calendarStore';
import ical from 'ical-generator';

// Константы для Google Calendar API
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// Функция для загрузки Google API Client
const loadGoogleApi = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('client:auth2', () => {
                window.gapi.client
                    .init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };
        script.onerror = () => {
            reject(new Error('Failed to load Google API script'));
        };
        document.body.appendChild(script);
    });
};

// Функция для авторизации в Google
const authorizeWithGoogle = async () => {
    try {
        await loadGoogleApi();

        if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await window.gapi.auth2.getAuthInstance().signIn();
        }

        return true;
    } catch (error) {
        console.error('Error authorizing with Google:', error);
        throw error;
    }
};

// Функция для импорта событий из Google Calendar
const importEventsFromGoogle = async () => {
    try {
        const authorized = await authorizeWithGoogle();
        if (!authorized) return [];

        const response = await window.gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 100,
            orderBy: 'startTime'
        });

        const events = response.result.items;
        return events.map((event) => ({
            title: event.summary,
            description: event.description || '',
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            allDay: !event.start.dateTime,
            googleId: event.id,
            color: '#4285F4', // Google Blue color
            type: 'appointment'
        }));
    } catch (error) {
        console.error('Error importing events from Google Calendar:', error);
        throw error;
    }
};

// Функция для экспорта событий в Google Calendar
const exportEventsToGoogle = async (events) => {
    try {
        const authorized = await authorizeWithGoogle();
        if (!authorized) return;

        const batch = window.gapi.client.newBatch();

        events.forEach((event, index) => {
            const googleEvent = {
                summary: event.title,
                description: event.description,
                start: {
                    dateTime: event.allDay ? undefined : event.start,
                    date: event.allDay ? event.start.split('T')[0] : undefined
                },
                end: {
                    dateTime: event.allDay ? undefined : event.end || event.start,
                    date: event.allDay ? (event.end ? event.end.split('T')[0] : event.start.split('T')[0]) : undefined
                }
            };

            batch.add(
                window.gapi.client.calendar.events.insert({
                    calendarId: 'primary',
                    resource: googleEvent
                }),
                { id: index }
            );
        });

        await batch.execute();
        return true;
    } catch (error) {
        console.error('Error exporting events to Google Calendar:', error);
        throw error;
    }
};

// Функция для создания iCal файла
const generateICalFile = (events) => {
    const calendar = ical({
        name: 'Календар задач та подій',
        timezone: 'Europe/Kiev'
    });

    events.forEach((event) => {
        calendar.createEvent({
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : new Date(event.start),
            summary: event.title,
            description: event.description,
            allDay: event.allDay
        });
    });

    return calendar.toString();
};

// Функция для экспорта в iCal
const exportToICal = (events) => {
    const calendarData = generateICalFile(events);
    const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendar-events.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Функция для синхронизации событий между локальным хранилищем и Google Calendar
const syncWithGoogleCalendar = async () => {
    const authStore = useAuthStore();
    const calendarStore = useCalendarStore();

    if (!authStore.user) return;

    try {
        const googleEvents = await importEventsFromGoogle();

        // Фильтруем события, которые уже существуют в локальном хранилище
        const newEvents = googleEvents.filter((googleEvent) => !calendarStore.events.some((localEvent) => localEvent.googleId === googleEvent.googleId));

        // Добавляем новые события в хранилище
        for (const event of newEvents) {
            await calendarStore.addEvent(event);
        }

        // Подготавливаем локальные события для экспорта в Google
        const eventsToExport = calendarStore.events.filter((event) => !event.googleId);

        // Экспортируем события в Google Calendar
        if (eventsToExport.length > 0) {
            await exportEventsToGoogle(eventsToExport);
        }

        return true;
    } catch (error) {
        console.error('Error syncing with Google Calendar:', error);
        throw error;
    }
};

export { importEventsFromGoogle, exportEventsToGoogle, exportToICal, syncWithGoogleCalendar };
