<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Chip from 'primevue/chip';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

const agent = ref({
    agency: 'test',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/friendlychat-you-tube-short.appspot.com/o/avatars%2Fundefined%2F%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.png?alt=media&token=e0ff2986-9e18-4576-a756-ffaf37ec9509',
    createdAt: '14 March 2025 at 16:35:05 UTC+2',
    email: 'test@test.com',
    id: '0YNV6IQ0RJTskXMPcxJHRbv85Go2',
    lastLogin: '14 March 2025 at 16:35:05 UTC+2',
    name: 'Олена Михалівна',
    phones: ['(404) 272-4952'],
    role: 'customer'
});

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

const formatDate = (dateString) => {
    return dateString.split(' at')[0];
};
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <!-- Agent Profile Card -->
            <Card class="mb-8">
                <template #header>
                    <div class="bg-blue-50 p-6 flex flex-col md:flex-row items-center">
                        <Avatar :image="agent.avatar" size="xlarge" shape="circle" class="mr-4 w-32 h-32 border-4 border-white shadow-lg" />
                        <div class="text-center md:text-left mt-4 md:mt-0">
                            <h2 class="text-2xl font-bold text-gray-800">{{ agent.name }}</h2>
                            <Chip label="Real Estate Agent" class="my-2" />
                            <div class="flex items-center justify-center md:justify-start mt-2">
                                <Badge :value="stats.customerRating" severity="success" />
                                <span class="ml-2 text-sm text-gray-600">Оцінка клієнтів</span>
                            </div>
                        </div>
                        <div class="ml-auto mt-4 md:mt-0">
                            <Button label="Зв'язатись" icon="fas fa-envelope" class="mr-2" />
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
                                    <i class="fas fa-envelope text-blue-600 mr-3"></i>
                                    <span>{{ agent?.email }}</span>
                                </div>
                                <div class="flex items-center" v-for="phone in agent.phones" :key="phone">
                                    <i class="fas fa-phone text-blue-600 mr-3"></i>
                                    <span>{{ phone }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-building text-blue-600 mr-3"></i>
                                    <span>Агенція:: {{ agent.agency }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-id-badge text-blue-600 mr-3"></i>
                                    <span>ID: {{ agent.id.substring(0, 8) }}...</span>
                                </div>
                            </div>
                        </div>

                        <!-- Agent Details -->
                        <div>
                            <h3 class="text-xl font-semibold text-gray-700 mb-4">Деталі агента</h3>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <i class="fas fa-user-tag text-blue-600 mr-3"></i>
                                    <span>Роль: {{ agent.role.charAt(0).toUpperCase() + agent.role.slice(1) }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-calendar text-blue-600 mr-3"></i>
                                    <span>З нами з: {{ formatDate(agent.createdAt) }}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-clock text-blue-600 mr-3"></i>
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
                                <i class="fas fa-list text-blue-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.activeListings }}</h4>
                                <p class="text-sm text-gray-600">Активні оголошення</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg text-center">
                                <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.soldLastYear }}</h4>
                                <p class="text-sm text-gray-600">Продано за рік</p>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg text-center">
                                <i class="fas fa-calendar-day text-yellow-600 text-2xl mb-2"></i>
                                <h4 class="text-lg font-semibold">{{ stats.averageDaysOnMarket }}</h4>
                                <p class="text-sm text-gray-600">Середній час на ринку</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg text-center">
                                <i class="fas fa-star text-purple-600 text-2xl mb-2"></i>
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
                <Card v-for="listing in listings" :key="listing.id" class="hover:shadow-lg transition-shadow">
                    <template #header>
                        <img :src="listing.image" :alt="listing.title" class="w-full h-48 object-cover" />
                    </template>
                    <template #title>
                        <div class="flex justify-between items-start">
                            <h4 class="text-lg font-semibold text-gray-800">{{ listing.title }}</h4>
                            <p class="text-xl font-bold text-blue-600">€{{ listing.price }}</p>
                        </div>
                    </template>
                    <template #content>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                                <span class="text-gray-700">{{ listing.location }}</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <div class="flex items-center">
                                    <i class="fas fa-bed mr-1"></i>
                                    <span>{{ listing.bedrooms }} beds</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-bath mr-1"></i>
                                    <span>{{ listing.bathrooms }} baths</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-vector-square mr-1"></i>
                                    <span>{{ listing.area }} m²</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <Button label="Деталі" icon="fas fa-search" class="p-button-text" />
                        <Button label="Контакти" icon="fas fa-envelope" class="p-button-outlined ml-2" />
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>
