<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

// Імпорт компонентів PrimeVue
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Textarea from 'primevue/textarea';

const toast = useToast();
const router = useRouter();

// Пошук та фільтрація
const searchQuery = ref('');
const sortBy = ref({ value: 'rating', label: 'Рейтинг (від високого до низького)' });
const sortOptions = [
    { value: 'rating', label: 'Рейтинг (від високого до низького)' },
    { value: 'ratingAsc', label: 'Рейтинг (від низького до високого)' },
    { value: 'name', label: "Ім'я (А-Я)" },
    { value: 'nameDesc', label: "Ім'я (Я-А)" },
    { value: 'experience', label: 'Досвід' },
    { value: 'listings', label: 'Кількість оголошень' }
];

const filters = ref([
    { label: 'Усі агенти', value: 'всі', active: true },
    { label: 'Рекомендовані', value: 'рекомендовані', active: false },
    { label: 'Досвід 5+ років', value: 'досвід', active: false },
    { label: 'Топ рейтинг', value: 'рейтинг', active: false },
    { label: 'Найактивніші', value: 'активність', active: false }
]);

// Пагінація
const first = ref(0);
const pageSize = ref(8);

// Діалог контакту
const contactDialogVisible = ref(false);
const selectedAgent = ref(null);
const contactForm = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
});

// Дані агентів
const agents = ref([
    {
        id: '0YNV6IQ0RJTskXMPcxJHRbv85Go2',
        name: 'Олена Михалівна',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/friendlychat-you-tube-short.appspot.com/o/avatars%2Fundefined%2F%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.png?alt=media&token=e0ff2986-9e18-4576-a756-ffaf37ec9509',
        email: 'test@test.com',
        phones: ['(404) 272-4952'],
        agency: 'test',
        role: 'customer',
        location: 'Київ, Україна',
        rating: 4.8,
        reviews: 24,
        experience: 3,
        activeListings: 12,
        soldLastYear: 24,
        featured: true
    },
    {
        id: 'agent2',
        name: 'Андрій Петренко',
        avatar: 'https://picsum.photos/id/1012/300/300',
        email: 'andriy@realestate.com',
        phones: ['(099) 123-4567'],
        agency: 'Premium Realty',
        role: 'agent',
        location: 'Львів, Україна',
        rating: 4.9,
        reviews: 56,
        experience: 7,
        activeListings: 24,
        soldLastYear: 36,
        featured: true
    },
    {
        id: 'agent3',
        name: 'Марія Ковальчук',
        avatar: 'https://picsum.photos/id/1027/300/300',
        email: 'maria@realestate.com',
        phones: ['(067) 987-6543'],
        agency: 'City Properties',
        role: 'agent',
        location: 'Одеса, Україна',
        rating: 4.5,
        reviews: 32,
        experience: 5,
        activeListings: 18,
        soldLastYear: 22,
        featured: false
    },
    {
        id: 'agent4',
        name: 'Олександр Шевченко',
        avatar: 'https://picsum.photos/id/1066/300/300',
        email: 'alex@realestate.com',
        phones: ['(050) 456-7890'],
        agency: 'Urban Homes',
        role: 'agent',
        location: 'Харків, Україна',
        rating: 4.7,
        reviews: 41,
        experience: 6,
        activeListings: 15,
        soldLastYear: 30,
        featured: false
    },
    {
        id: 'agent5',
        name: 'Наталія Іваненко',
        avatar: 'https://picsum.photos/id/1076/300/300',
        email: 'natalia@realestate.com',
        phones: ['(098) 765-4321'],
        agency: 'Premier Properties',
        role: 'agent',
        location: 'Дніпро, Україна',
        rating: 4.6,
        reviews: 38,
        experience: 4,
        activeListings: 21,
        soldLastYear: 28,
        featured: true
    },
    {
        id: 'agent6',
        name: 'Віктор Коваленко',
        avatar: 'https://picsum.photos/id/1074/300/300',
        email: 'viktor@realestate.com',
        phones: ['(073) 222-3333'],
        agency: 'Elite Estates',
        role: 'broker',
        location: 'Запоріжжя, Україна',
        rating: 4.4,
        reviews: 29,
        experience: 8,
        activeListings: 17,
        soldLastYear: 19,
        featured: false
    },
    {
        id: 'agent7',
        name: 'Анна Лисенко',
        avatar: 'https://picsum.photos/id/1084/300/300',
        email: 'anna@realestate.com',
        phones: ['(095) 111-2345'],
        agency: 'Home Finders',
        role: 'agent',
        location: 'Київ, Україна',
        rating: 4.9,
        reviews: 52,
        experience: 9,
        activeListings: 28,
        soldLastYear: 42,
        featured: true
    },
    {
        id: 'agent8',
        name: 'Сергій Мельник',
        avatar: 'https://picsum.photos/id/169/300/300',
        email: 'sergey@realestate.com',
        phones: ['(063) 987-5432'],
        agency: 'Modern Realty',
        role: 'agent',
        location: 'Івано-Франківськ, Україна',
        rating: 4.3,
        reviews: 27,
        experience: 2,
        activeListings: 9,
        soldLastYear: 14,
        featured: false
    },
    {
        id: 'agent9',
        name: 'Юлія Бондаренко',
        avatar: 'https://picsum.photos/id/177/300/300',
        email: 'yulia@realestate.com',
        phones: ['(066) 555-4444'],
        agency: 'Prime Locations',
        role: 'agent',
        location: 'Вінниця, Україна',
        rating: 4.7,
        reviews: 35,
        experience: 5,
        activeListings: 16,
        soldLastYear: 26,
        featured: false
    },
    {
        id: 'agent10',
        name: 'Максим Ткаченко',
        avatar: 'https://picsum.photos/id/1005/300/300',
        email: 'maxim@realestate.com',
        phones: ['(097) 333-2211'],
        agency: 'Century Properties',
        role: 'broker',
        location: 'Львів, Україна',
        rating: 4.8,
        reviews: 46,
        experience: 12,
        activeListings: 31,
        soldLastYear: 38,
        featured: true
    }
]);

// Фільтрація та сортування агентів
const filteredAgents = computed(() => {
    let result = [...agents.value];

    // Застосування фільтрів
    const activeFilters = filters.value.filter((f) => f.active).map((f) => f.value);

    if (activeFilters.length > 0 && !activeFilters.includes('всі')) {
        result = result.filter((agent) => {
            return (
                (activeFilters.includes('рекомендовані') && agent.featured) ||
                (activeFilters.includes('досвід') && agent.experience >= 5) ||
                (activeFilters.includes('рейтинг') && agent.rating >= 4.7) ||
                (activeFilters.includes('активність') && agent.activeListings > 20)
            );
        });
    }

    // Пошук
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((agent) => {
            return agent.name.toLowerCase().includes(query) || agent.agency.toLowerCase().includes(query) || agent.location.toLowerCase().includes(query) || agent.email.toLowerCase().includes(query);
        });
    }

    // Сортування
    switch (sortBy.value.value) {
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
        case 'ratingAsc':
            result.sort((a, b) => a.rating - b.rating);
            break;
        case 'name':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'experience':
            result.sort((a, b) => b.experience - a.experience);
            break;
        case 'listings':
            result.sort((a, b) => b.activeListings - a.activeListings);
            break;
    }

    // Пагінація
    return result.slice(first.value, first.value + pageSize.value);
});

const totalAgents = computed(() => agents.value.length);

// Методи
const toggleFilter = (index) => {
    if (filters.value[index].value === 'всі') {
        filters.value.forEach((filter, i) => {
            filters.value[i].active = i === index;
        });
    } else {
        filters.value[0].active = false;
        filters.value[index].active = !filters.value[index].active;

        if (!filters.value.some((filter) => filter.active)) {
            filters.value[0].active = true;
        }
    }
};

const onPageChange = (event) => {
    first.value = event.first;
};

const viewAgentProfile = (agentId) => {
    console.log(`Перегляд профілю агента з ID: ${agentId}`);
    router.push('/agents/' + agentId);
};

const contactAgent = (agent) => {
    selectedAgent.value = agent;
    contactForm.value = {
        name: '',
        email: '',
        phone: '',
        message: `Вітаю ${agent.name}, я зацікавлений у співпраці з вами для пошуку нерухомості.`
    };
    contactDialogVisible.value = true;
};

const closeContactDialog = () => {
    contactDialogVisible.value = false;
    selectedAgent.value = null;
};

const sendMessage = () => {
    console.log('Надсилання повідомлення агенту:', selectedAgent.value.name);
    console.log('Дані повідомлення:', contactForm.value);

    toast.add({
        severity: 'success',
        summary: 'Повідомлення надіслано',
        detail: `Ваше повідомлення для ${selectedAgent.value.name} успішно надіслано!`,
        life: 3000
    });

    closeContactDialog();
};
</script>

<template>
    <div class="agents-list-container">
        <!-- Заголовок -->
        <div class="bg-white p-6 shadow-md rounded-lg mb-6">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                <section>
                    <h2 class="text-2xl font-bold text-gray-800">Агенти з нерухомості</h2>
                    <p class="text-gray-600">Знайдіть найкращих агентів для вашої нерухомості</p>
                </section>

                <div class="mt-4 md:mt-0">
                    <div class="flex items-center">
                        <div class="relative">
                            <InputText v-model="searchQuery" placeholder="Пошук агентів..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div class="absolute left-3 top-2.5 text-gray-400">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <Dropdown v-model="sortBy" :options="sortOptions" optionLabel="label" placeholder="Сортувати за" class="w-40" />
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            <!-- Фільтри -->
            <div class="flex flex-wrap gap-4 mb-4">
                <Button v-for="(filter, index) in filters" :key="index" :label="filter.label" :class="{ 'p-button-outlined': !filter.active, 'p-button-primary': filter.active }" @click="toggleFilter(index)" />
            </div>
        </div>

        <!-- Список агентів -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="agent in filteredAgents" :key="agent.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <!-- Картка агента -->
                <div class="relative">
                    <!-- Бейдж "Рекомендовано" -->
                    <div v-if="agent.featured" class="absolute top-4 right-4">
                        <Badge value="Рекомендовано" severity="warning" />
                    </div>

                    <!-- Бейдж досвіду -->
                    <div v-if="agent.experience >= 5" class="absolute top-4 left-4">
                        <Badge :value="`${agent.experience}+ років`" severity="info" />
                    </div>

                    <!-- Фото агента -->
                    <div class="p-6 flex flex-col items-center">
                        <Avatar :image="agent.avatar" size="xlarge" shape="circle" class="w-24 h-24 border-4 border-white shadow-md mb-4" />
                        <h3 class="text-xl font-semibold text-center">{{ agent.name }}</h3>
                        <Chip :label="agent.role" class="my-2" />

                        <!-- Рейтинг -->
                        <div class="flex items-center mt-1">
                            <div class="flex">
                                <i
                                    v-for="star in 5"
                                    :key="star"
                                    :class="['text-sm', star <= Math.floor(agent.rating) ? 'fas fa-star text-yellow-400' : star - 0.5 <= agent.rating ? 'fas fa-star-half-alt text-yellow-400' : 'far fa-star text-yellow-400']"
                                ></i>
                            </div>
                            <span class="ml-1 text-sm text-gray-600">({{ agent.reviews }})</span>
                        </div>
                    </div>

                    <Divider />

                    <!-- Деталі агента -->
                    <div class="px-6 py-4">
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <i class="fas fa-building text-blue-600 w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.agency }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt text-blue-600 w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.location }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-envelope text-blue-600 w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.email }}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-phone text-blue-600 w-5"></i>
                                <span class="ml-2 text-gray-700">{{ agent.phones[0] }}</span>
                            </div>
                        </div>

                        <!-- Статистика -->
                        <div class="grid grid-cols-2 gap-2 mt-4">
                            <div class="text-center bg-blue-50 rounded-md p-2">
                                <div class="text-lg font-semibold text-blue-700">{{ agent.activeListings }}</div>
                                <div class="text-xs text-gray-600">Оголошень</div>
                            </div>
                            <div class="text-center bg-green-50 rounded-md p-2">
                                <div class="text-lg font-semibold text-green-700">{{ agent.soldLastYear }}</div>
                                <div class="text-xs text-gray-600">Продано</div>
                            </div>
                        </div>
                    </div>

                    <!-- Кнопки дій -->
                    <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div class="flex space-x-2">
                            <Button label="Профіль" icon="fas fa-user" class="p-button-outlined w-1/2" @click="viewAgentProfile(agent.id)" />
                            <Button label="Контакт" icon="fas fa-envelope" class="p-button-primary w-1/2" @click="contactAgent(agent)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Пагінація -->
        <div class="flex justify-center mt-8">
            <Paginator v-model:first="first" :rows="pageSize" :totalRecords="totalAgents" @page="onPageChange" />
        </div>

        <!-- Діалог контакту -->
        <Dialog v-model:visible="contactDialogVisible" :style="{ width: '450px' }" header="Зв'язатися з агентом" :modal="true">
            <div v-if="selectedAgent" class="p-fluid">
                <div class="flex items-center mb-4">
                    <Avatar :image="selectedAgent.avatar" shape="circle" class="mr-3" />
                    <div>
                        <h4 class="text-lg font-semibold">{{ selectedAgent.name }}</h4>
                        <p class="text-sm text-gray-600">{{ selectedAgent.agency }}</p>
                    </div>
                </div>

                <div class="field mb-4">
                    <label for="name" class="font-medium text-gray-700 block mb-2">Ваше ім'я</label>
                    <InputText id="name" v-model="contactForm.name" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="email" class="font-medium text-gray-700 block mb-2">Email</label>
                    <InputText id="email" v-model="contactForm.email" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="phone" class="font-medium text-gray-700 block mb-2">Телефон</label>
                    <InputText id="phone" v-model="contactForm.phone" class="w-full" />
                </div>

                <div class="field mb-4">
                    <label for="message" class="font-medium text-gray-700 block mb-2">Повідомлення</label>
                    <Textarea id="message" v-model="contactForm.message" rows="5" autoResize class="w-full" />
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
