<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Chip from 'primevue/chip';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import { useUserStore } from '@/store/userStore'; // Store для користувачів/агентів
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const agent = computed(() => userStore.selectedAgent);
const router = useRouter();


const listings = ref([
    {
        id: 1,
        title: 'Modern Apartment in City Center',
        price: '245,000',
        location: 'Київ, Центр',
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        image: 'https://picsum.photos/id/1067/300/200'
    },
    {
        id: 2,
        title: 'Luxury Villa with Pool',
        price: '495,000',
        location: 'Одеса, Приморський',
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        image: 'https://picsum.photos/id/164/300/200'
    },
    {
        id: 3,
        title: 'Cozy Family House',
        price: '320,000',
        location: 'Львів, Шевченківський',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        image: 'https://picsum.photos/id/871/300/200'
    }
]);

const stats = ref({
    activeListings: 12,
    soldLastYear: 24,
    averageDaysOnMarket: 45,
    customerRating: 4.8
});

// Функція для форматування об'єкта Firebase Timestamp
const formatDate = (timestamp) => {
    // Перевіряємо, чи вхідні дані схожі на Firebase Timestamp
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        console.warn('Некоректні вхідні дані для formatDate:', timestamp);
        return 'Невідома дата'; // Обробка випадків, коли це не Timestamp
    }

    // Перетворюємо Firebase Timestamp у стандартний JavaScript Date об'єкт
    const date = timestamp.toDate();

    // Перевіряємо, чи перетворення дало коректну дату
    if (isNaN(date.getTime())) {
         console.warn('Некоректний результат дати з Timestamp:', timestamp);
         return 'Невірна дата'; // Обробка помилок перетворення
    }

    // Форматуємо об'єкт Date у рядок
    // Рекомендовано використовувати Intl.DateTimeFormat для локалізованого форматування
    try {
        return new Intl.DateTimeFormat('uk-UA', { // 'uk-UA' для української локалі
            year: 'numeric', // Рік (наприклад, 2023)
            month: 'long',   // Місяць повною назвою (наприклад, квітень)
            day: 'numeric',    // День місяця (наприклад, 21)            
        }).format(date);
    } catch (e) {
        console.error('Помилка форматування дати за допомогою Intl.DateTimeFormat:', e);
        // Якщо Intl.DateTimeFormat не спрацював (рідко), повертаємо простий формат
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Місяці 0-індексовані
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`; // Формат ДД.ММ.РРРР
    }

    // Якщо вам потрібен конкретний формат, наприклад, "YYYY-MM-DD", незалежно від локалі:
    // const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = date.getDate().toString().padStart(2, '0');
    // return `${year}-${month}-${day}`;
};

const viewListing = (listing) => {
    console.log(`Перегляд оголошення: ${listing}`);
    const category = listing.category.code;
    const subcategory = listing.subcategory.code;
    router.push(`/pages/${category}/view/${subcategory}/${listing.id}?category=${category}&subcategory=${subcategory}`)
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 max-w-screen-lg mx-auto">
        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <!-- Agent Profile Card -->
            <Card class="mb-8">
                <template #header>
                    <div class="bg-blue-50 p-6 flex flex-col md:flex-row items-center">
                        <Avatar :image="agent.avatar" size="xlarge" shape="circle" class="mr-4 w-32 h-32 border-4 border-white shadow-lg" />
                        <div class="text-center md:text-left mt-4 md:mt-0">
                            <h2 class="text-2xl font-bold text-gray-800">{{ agent.name }}</h2>
                            <Chip :label="agent.agency" class="my-2" />
                            <div class="flex items-center justify-center md:justify-start mt-2">
                                <Badge :value="stats.customerRating" severity="success" />
                                <span class="ml-2 text-sm text-gray-600">Оцінка клієнтів</span>
                            </div>
                        </div>                        
                    </div>
                </template>

                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <!-- Contact Info -->
                        <div>
                            <h3 class="text-xl font-semibold text-gray-700 mb-4">Контактна інформація</h3>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <i class="pi pi-envelope text-blue-600 mr-3"></i>
                                    <span>{{ agent?.email }}</span>
                                </div>
                                <div class="flex items-center" v-for="phone in agent.phones" :key="phone">
                                    <i class="pi pi-phone text-blue-600 mr-3"></i>
                                    <span>{{ phone }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="pi pi-building text-blue-600 mr-3"></i>
                                    <span>Агенція:: {{ agent.agency }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="pi pi-id-card text-blue-600 mr-3"></i>
                                    <span>ID: {{ agent.id.substring(0, 8) }}...</span>
                                </div>
                            </div>
                        </div>

                        <!-- Agent Details -->
                        <div>
                            <h3 class="text-xl font-semibold text-gray-700 mb-4">Деталі агента</h3>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <i class="pi pi-user text-blue-600 mr-3"></i>
                                    <span>Роль: {{ agent.role.charAt(0).toUpperCase() + agent.role.slice(1) }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="pi pi-calendar text-blue-600 mr-3"></i>
                                    <span>З нами з: {{ formatDate(agent.createdAt) }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="pi pi-clock text-blue-600 mr-3"></i>
                                    <span>Остання активність: {{ formatDate(agent.lastLogin) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <!-- Agent Stats -->
                    <div class="p-4">
                        <h3 class="text-xl font-semibold text-gray-700 mb-4">Статистика агента</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-blue-50 p-4 rounded-lg text-center">
                                <i class="pi pi-list text-blue-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ agent.propertyCount }}</h4>
                                <p class="text-sm text-gray-600">Активні оголошення</p>
                            </div>
                            <!-- <div class="bg-green-50 p-4 rounded-lg text-center">
                                <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.soldLastYear }}</h4>
                                <p class="text-sm text-gray-600">Продано за рік</p>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg text-center">
                                <i class="fas fa-calendar-day text-yellow-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.averageDaysOnMarket }}</h4>
                                <p class="text-sm text-gray-600">Середній час на ринку</p>
                            </div> -->
                            <div class="bg-purple-50 p-4 rounded-lg text-center">
                                <i class="pi pi-star text-purple-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.customerRating }}/5</h4>
                                <p class="text-sm text-gray-600">Оцінка клієнтів</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Listings -->
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Поточні списки</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card v-for="listing in agent.propertyList" :key="listing.id" class="hover:shadow-lg transition-shadow flex flex-col justify-between h-full">
                    <template #header>
                        <img :src="listing.images[0].url" :alt="listing.title" class="w-full h-48 object-cover" />
                    </template>
                    <template #title>
                        <div class="flex justify-between items-start">
                            <h4 class="text-lg font-semibold text-gray-800">{{ listing.title }}</h4>
                            <p class="text-xl font-bold text-blue-600">€{{ listing.price }}</p>
                        </div>
                        <div class="flex items-center text-sm">                            
                            <span>{{ listing.category.name }} / {{ listing.subcategory.name }}</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="space-y-6 text-sm text-gray-600 my-4">                            
                            <div class="flex justify-between text-gray-600">                                
                                <div class="flex items-center">
                                    <i class="pi pi-map-marker mr-1"></i>
                                    <span>{{ listing.address?.region?.name }} / {{ listing.address?.city?.Description }}</span>                                    
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-vector-square mr-1"></i>
                                    <span>{{ listing.apartmentArea?.totalArea }} m²</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <Button @click="viewListing(listing)" label="Деталі" icon="pi pi-eye" class="p-button-outlined ml-2" />                        
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>
