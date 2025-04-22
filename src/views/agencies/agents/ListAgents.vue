<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
// *** Імпортуємо ваші Store ***
import { useUserStore } from '@/store/userStore'; // Store для користувачів/агентів
import { usePropertiesStore } from '@/store/propertiesCategories'; // Store для об'єктів нерухомості

// Імпорт компонентів PrimeVue
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog'; // Для діалогу контакту
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Textarea from 'primevue/textarea'; // Для діалогу контакту
// Можливо, потрібен компонент для зірок рейтингу, якщо використовуєте
// import Rating from 'primevue/rating';

const toast = useToast();
const router = useRouter();

// *** Отримуємо екземпляри Store ***
const userStore = useUserStore(); // Store для користувачів (включаючи агентів)
const propertiesStore = usePropertiesStore(); // Store для об'єктів нерухомості

// Пошук та фільтрація
const searchQuery = ref('');
const sortBy = ref({ value: 'listings', label: "Кількість об'єктів (від більшого до меншого)" }); // Змінено сортування за замовчуванням
const sortOptions = [
    // Оновлюємо опції сортування відповідно до доступних полів + нового propertyCount
    // Якщо поля rating, experience є у ваших об'єктах користувачів зі Store
    { value: 'rating', label: 'Рейтинг (від високого до низького)' },
    { value: 'ratingAsc', label: 'Рейтинг (від низького до високого)' },
    { value: 'name', label: "Ім'я (А-Я)" },
    { value: 'nameDesc', label: "Ім'я (Я-А)" },
    { value: 'experience', label: 'Досвід' }, // Якщо поле experience є у userStore.users
    { value: 'listings', label: "Кількість об'єктів" } // Тепер це буде сортування за propertyCount
];

// Фільтри
const filters = ref([
    { label: 'Усі агенти', value: 'all', active: true }, // Змінено value на 'all'
    { label: 'Рекомендовані', value: 'featured', active: false }, // Змінено value на 'featured'
    { label: 'Досвід 5+ років', value: 'experience_5plus', active: false }, // Змінено value
    { label: 'Топ рейтинг (4.7+)', value: 'top_rating', active: false }, // Змінено value
    { label: 'Найактивніші (20+ об)', value: 'most_active', active: false } // Змінено value
]);

// Пагінація
const first = ref(0); // Поточний індекс першого елемента для пагінатора
const pageSize = ref(8); // Кількість елементів на сторінці

// Діалог контакту (якщо використовуєте)
const contactDialogVisible = ref(false);
const selectedAgent = ref(null);
const contactForm = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
});

// *** Завантажуємо дані при монтуванні компонента ***
const allProperties = ref([]);
onMounted(async () => {
    console.log("Завантаження даних (користувачів та об'єктів нерухомості)...");
    await Promise.all([
        userStore.fetchUsers(), // Завантажує користувачів
        (allProperties.value = await propertiesStore.getAllPropertiesDataConcurrent()) // Завантажує об'єкти
    ]).catch((error) => {
        console.error('Помилка при паралельному завантаженні даних:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка завантаження',
            detail: 'Не вдалося завантажити всі дані. Спробуйте оновити сторінку.',
            life: 5000
        });
    });
});

// *** Computed властивість, що об'єднує користувачів з підрахунком об'єктів та фільтрує лише агентів ***
const agentsWithCounts = computed(() => {
    // Отримуємо списки користувачів та об'єктів нерухомості зі стану Store
    const allUsers = userStore.users; // Список усіх користувачів (включаючи агентів)

    console.log('allUsers >>', allUsers);
    console.log('allProperties >>', allProperties.value);
    // Повертаємо порожній масив, якщо дані ще не завантажені або порожні
    if (!allUsers || allUsers.length === 0 || !allProperties.value || allProperties.value.length === 0) {
        return [];
    }
    console.log('allUsers >>', allUsers);

    // 1. Підраховуємо об'єкти для кожного creator.id
    const propertyCounts = new Map();
    allProperties.value.forEach((property) => {
        const creatorId = property.creator?.id;
        if (creatorId) {
            propertyCounts.set(creatorId, (propertyCounts.get(creatorId) || 0) + 1);
        }
    });

    // 2. Фільтруємо список користувачів, залишаючи лише агентів, та додаємо підрахунок об'єктів
    const agentsList = allUsers.map((agent) => {
        const count = propertyCounts.get(agent.id) || 0; // Підрахунок об'єктів для цього агента
        const propertyList = allProperties.value.filter((property) => property.creator?.id === agent.id);
        return {
            // Копіюємо існуючі дані агента
            ...agent,
            // Додаємо підраховану кількість об'єктів
            propertyCount: count,
            propertyList: propertyList
        };
    });
    return agentsList; // Повертаємо збагачений список агентів
});

const cities = computed(() => {
    // Перевіряємо, чи агентства завантажені і чи є поле city (яке тепер об'єкт)
    if (!agentsWithCounts.value || agentsWithCounts.value.length === 0) {
        return [];
    }
    // Витягуємо Description з об'єкта city, фільтруємо null/undefined, отримуємо унікальні
    const allCities = agentsWithCounts.value
        .map((a) => a.city?.Description) // Припускаємо, що city - об'єкт з полем Description
        .filter(Boolean); // Видаляємо null, undefined або порожні рядки

    const uniqueCities = [...new Set(allCities)];
    // Формуємо опції для Dropdown { label: 'Назва міста', value: 'Назва міста' }
    return uniqueCities.map((cityDescription) => ({ label: cityDescription, value: cityDescription }));
});

// *** Computed властивість для загальної кількості агентів (для пагінації) ***
// Тепер рахуємо кількість у збагаченому списку агентів
const totalAgents = computed(() => agentsWithCounts.value.length);

// *** Computed властивість для фінального списку агентів після фільтрації, сортування та пагінації ***
const filteredAgents = computed(() => {
    let result = [...agentsWithCounts.value]; // Працюємо зі збагаченим списком агентів
    console.log('result', result);

    // Застосування фільтрів
    const activeFilters = filters.value.filter((f) => f.active).map((f) => f.value);
    console.log('activeFilters', activeFilters);

    // Якщо активний фільтр "Усі агенти" або немає активних фільтрів, показуємо всіх
    if (!activeFilters.includes('all') && activeFilters.length > 0) {
        result = result.filter((agent) => {
            return (
                (activeFilters.includes('featured') && agent.featured) || // Поле featured має бути у userStore.users
                (activeFilters.includes('experience_5plus') && agent.experience >= 5) || // Поле experience має бути у userStore.users
                (activeFilters.includes('top_rating') && agent.rating >= 4.7) || // Поле rating має бути у userStore.users
                (activeFilters.includes('most_active') && agent.propertyCount > 20) // *** Фільтр за propertyCount ***
            );
        });
    }

    // Пошук
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((agent) => {
            // Перевіряємо поля, які є у userStore.users
            return (
                agent.name.toLowerCase().includes(query) ||
                (agent.agency?.toLowerCase() || '').includes(query) || // Перевірка agency з optional chaining
                (agent.location?.toLowerCase() || '').includes(query) || // Перевірка location з optional chaining
                (agent.email?.toLowerCase() || '').includes(query)
            );
        });
    }

    // Сортування
    switch (sortBy.value.value) {
        case 'rating':
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Додано обробку null/undefined для числових полів
            break;
        case 'ratingAsc':
            result.sort((a, b) => (a.rating || 0) - (b.rating || 0)); // Додано обробку null/undefined
            break;
        case 'name':
            result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); // Додано обробку null/undefined
            break;
        case 'nameDesc':
            result.sort((a, b) => (b.name || '').localeCompare(a.name || '')); // Додано обробку null/undefined
            break;
        case 'experience':
            result.sort((a, b) => (b.experience || 0) - (a.experience || 0)); // Додано обробку null/undefined
            break;
        case 'listings':
            result.sort((a, b) => b.propertyCount - a.propertyCount); // *** Сортування за propertyCount ***
            break;
    }

    // Пагінація
    // Застосовуємо пагінацію до відфільтрованих та відсортованих результатів
    return result.slice(first.value, first.value + pageSize.value);
});

// Методи для фільтрів, пагінатора, перегляду профілю, контакту
const toggleFilter = (index) => {
    // Логіка перемикання фільтрів залишається без змін
    if (filters.value[index].value === 'all') {
        filters.value.forEach((filter, i) => {
            filters.value[i].active = i === index;
        });
    } else {
        filters.value[0].active = false;
        filters.value[index].active = !filters.value[index].active;

        if (!filters.value.some((filter) => filter.active)) {
            filters.value[0].active = true; // Якщо жоден фільтр не активний, активуємо "Усі агенти"
        }
    }
    // Скидаємо пагінацію при зміні фільтрів
    first.value = 0;
};

const onPageChange = (event) => {
    first.value = event.first;
};

const viewAgentProfile = (agent) => {
    console.log(`Перегляд профілю агента: ${agent}`);
    userStore.setSelectedAgent(agent);
    router.push('/agents/' + agent.id); // Маршрут до профілю агента
};

const closeContactDialog = () => {
    contactDialogVisible.value = false;
    selectedAgent.value = null;
};
</script>

<template>
    <div class="agents-list-container">
        <Toast />
        <div class="bg-white p-6 shadow-md rounded-lg mb-6">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                <section>
                    <h2 class="text-2xl font-bold text-gray-800">Агенти з нерухомості</h2>
                    <p class="text-gray-600">Знайдіть найкращих агентів для вашої нерухомості</p>
                </section>

                <div class="mt-4 md:mt-0 w-full md:w-auto">
                    <div class="flex flex-col sm:flex-row items-center gap-4">
                        <Dropdown v-model="selectedCity" :options="cities" option-label="label" option-value="value" placeholder="Оберіть місто" class="w-full" show-clear />
                        <div class="p-input-icon-left flex-grow w-full sm:w-auto min-w-36">
                            <InputText v-model="searchQuery" placeholder="Пошук агентів..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div class="w-full sm:w-auto"><Dropdown v-model="sortBy" :options="sortOptions" optionLabel="label" placeholder="Сортувати за" class="w-full" /></div>
                    </div>
                </div>
            </div>

            <Divider />

            <div v-if="!userStore.loading && !propertiesStore.loading && !userStore.error && !propertiesStore.error" class="flex flex-wrap gap-2 md:gap-4 mb-4">
                <Button v-for="(filter, index) in filters" :key="filter.value" :label="filter.label" :class="{ 'p-button-outlined': !filter.active, 'p-button-primary': filter.active }" @click="toggleFilter(index)" />
            </div>
            <div v-else class="text-center text-gray-500">
                <span v-if="userStore.loading || propertiesStore.loading">Завантаження фільтрів...</span>
                <span v-else-if="userStore.error || propertiesStore.error">Неможливо завантажити фільтри через помилку.</span>
            </div>
        </div>

        <div v-if="userStore.loading || propertiesStore.loading" class="text-center text-blue-600 mt-10">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Завантаження списку агентів та статистики об'єктів...</p>
        </div>

        <div v-else-if="userStore.error || propertiesStore.error" class="text-center text-red-600 mt-10">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
            <p>Помилка завантаження даних користувачів/об'єктів:</p>
            <p>{{ userStore.error?.message || propertiesStore.error?.message || 'Невідома помилка.' }}</p>
        </div>

        <div v-else-if="filteredAgents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="agent in filteredAgents" :key="agent.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="relative flex flex-col h-full justify-between">
                    <div class="p-6 flex flex-col items-center">
                        <!-- Бейдж "Рекомендовано" -->
                        <div v-if="agent.featured" class="absolute top-4 right-4">
                            <Badge value="Рекомендовано" severity="warning" />
                        </div>

                        <!-- Бейдж досвіду -->
                        <div v-if="agent.experience >= 5" class="absolute top-4 left-4">
                            <Badge :value="`${agent.experience}+ років`" severity="info" />
                        </div>
                        <Avatar :image="agent.avatar" size="xlarge" shape="circle" class="w-24 h-24 border-4 border-white shadow-md mb-4" />
                        <h3 class="text-xl font-semibold text-center">{{ agent.name || agent.email || agent.id }}</h3>
                        <div v-if="agent.rating !== undefined && agent.rating !== null" class="flex items-center mt-1">
                            <div class="flex">
                                <i
                                    v-for="star in 5"
                                    :key="star"
                                    :class="['text-sm', star <= Math.floor(agent.rating) ? 'pi pi-star-fill text-yellow-400' : star - 0.5 <= agent.rating ? 'pi pi-star text-yellow-400' : 'pi pi-star text-yellow-400']"
                                ></i>
                            </div>
                            <span v-if="agent.reviews !== undefined && agent.reviews !== null" class="ml-1 text-sm text-gray-600">({{ agent.reviews }})</span>
                            <span v-else class="ml-1 text-sm text-gray-600">(без відгуків)</span>
                        </div>
                        <div v-else class="text-sm text-gray-600 mt-1">Без рейтингу</div>
                    </div>

                    <Divider />

                    <div class="px-6 py-4">
                        <div class="space-y-2 text-sm">
                            <div v-if="agent.agency" class="flex items-center">
                                <i class="pi pi-building w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.agency }}</span>
                            </div>
                            <div v-if="agent.location" class="flex items-center">
                                <i class="pi pi-map-marker w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.location }}</span>
                            </div>
                            <div v-if="agent.email" class="flex items-center">
                                <i class="pi pi-envelope w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.email }}</span>
                            </div>
                            <div v-if="agent.phones && agent.phones.length > 0" v-for="phone in agent.phones" class="flex items-center">
                                <i class="pi pi-phone w-5"></i>
                                <span class="ml-2 text-gray-700">{{ phone }}</span>
                            </div>
                            <div v-else class="flex items-center">
                                <i class="fas fa-phone text-gray-400 w-5"></i>
                                <span class="ml-2 text-gray-500">Телефон не вказано</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2 mt-4">
                            <div class="text-center bg-blue-50 rounded-md p-2 col-span-2">
                                <div class="text-lg font-semibold text-blue-700">{{ agent.propertyCount }}</div>
                                <div class="text-xs text-gray-600">Об'єктів в базі</div>
                            </div>
                            <div v-if="agent.experience !== undefined && agent.experience !== null" class="text-center bg-green-50 rounded-md p-2 col-span-1">
                                <div class="text-lg font-semibold text-green-700">{{ agent.experience }}</div>
                                <div class="text-xs text-gray-600">Років досвіду</div>
                            </div>
                            <div v-if="agent.reviews !== undefined && agent.reviews !== null" class="text-center bg-yellow-50 rounded-md p-2 col-span-1">
                                <div class="text-lg font-semibold text-yellow-700">{{ agent.reviews }}</div>
                                <div class="text-xs text-gray-600">Відгуків</div>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div class="flex space-x-2">
                            <Button label="Профіль" icon="fas fa-user" class="p-button-outlined w-1/2" @click="viewAgentProfile(agent)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="!userStore.loading && !propertiesStore.loading && !userStore.error && !propertiesStore.error && filteredAgents.length === 0" class="text-center text-gray-500 mt-10">
            <p v-if="searchQuery.trim() !== '' || filters.some((f) => f.active && f.value !== 'all')">За вашим запитом нічого не знайдено.</p>
            <p v-else-if="userStore.users.length > 0 && !userStore.users.some((u) => u.role === 'agent')">Користувачі знайдено, але серед них немає агентів.</p>
            <p v-else>Агенти ще не додані або не мають об'єктів.</p>
        </div>

        <div v-if="filteredAgents.length > 0" class="flex justify-center mt-8">
            <Paginator v-model:first="first" :rows="pageSize" :totalRecords="totalAgents" @page="onPageChange" />
        </div>

        <Dialog v-model:visible="contactDialogVisible" :style="{ width: '450px' }" header="Зв'язатися з агентом" :modal="true">
            <div v-if="selectedAgent" class="p-fluid">
                <div class="flex items-center mb-4">
                    <Avatar :image="selectedAgent.avatar" shape="circle" class="mr-3" />
                    <div>
                        <h4 class="text-lg font-semibold">{{ selectedAgent.name || selectedAgent.email }}</h4>
                        <p v-if="selectedAgent.agency" class="text-sm text-gray-600">{{ selectedAgent.agency }}</p>
                    </div>
                </div>

                <div class="field mb-4">
                    <label for="contact-name" class="font-medium text-gray-700 block mb-2">Ваше ім'я</label>
                    <InputText id="contact-name" v-model="contactForm.name" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="contact-email" class="font-medium text-gray-700 block mb-2">Email</label>
                    <InputText id="contact-email" v-model="contactForm.email" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="contact-phone" class="font-medium text-gray-700 block mb-2">Телефон</label>
                    <InputText id="contact-phone" v-model="contactForm.phone" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="contact-message" class="font-medium text-gray-700 block mb-2">Повідомлення</label>
                    <Textarea id="contact-message" v-model="contactForm.message" rows="5" autoResize class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Скасувати" icon="fas fa-times" @click="closeContactDialog" class="p-button-text" />
                <Button label="Надіслати" icon="fas fa-paper-plane" @click="sendMessage" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.agents-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

.hover\:shadow-lg {
    transition: all 0.3s ease;
}
</style>
