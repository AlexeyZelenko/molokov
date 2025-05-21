<script setup>
import { ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const searchQuery = ref('');
const selectedPreferences = ref([]);
const showResults = ref(false);
const isSearching = ref(false);
const matchedProperties = ref([]);

// Доступные предпочтения для персонализированного подбора
const availablePreferences = [
    { id: 1, name: 'Близкость к метро', icon: 'pi pi-map-marker' },
    { id: 2, name: 'Новостройка', icon: 'pi pi-building' },
    { id: 3, name: 'С парковкой', icon: 'pi pi-car' },
    { id: 4, name: 'С балконом', icon: 'pi pi-home' },
    { id: 5, name: 'Рядом с парком', icon: 'pi pi-tree' },
    { id: 6, name: 'Для семьи с детьми', icon: 'pi pi-users' },
    { id: 7, name: 'Тихий район', icon: 'pi pi-volume-off' },
    { id: 8, name: 'Развитая инфраструктура', icon: 'pi pi-th-large' }
];

// Примеры результатов (в реальном приложении здесь был бы API-запрос)
const exampleResults = [
    { 
        id: 101, 
        title: '3-комнатная квартира в ЖК "Парковый"', 
        address: 'Киев, Голосеевский р-н, ул. Ломоносова, 58',
        price: '120 000',
        area: 78,
        rooms: 3,
        floor: 7,
        totalFloors: 25,
        buildingType: 'Новостройка',
        image: 'https://img.freepik.com/free-photo/empty-modern-room-with-furniture_23-2149178335.jpg',
        matchPercent: 98
    },
    { 
        id: 102, 
        title: '2-комнатная квартира с ремонтом', 
        address: 'Киев, Дарницкий р-н, ул. Ревуцкого, 42',
        price: '85 000',
        area: 56,
        rooms: 2,
        floor: 4,
        totalFloors: 9,
        buildingType: 'Кирпичный дом',
        image: 'https://img.freepik.com/free-photo/modern-luxury-domestic-room-interior-design_23-2150153852.jpg',
        matchPercent: 94
    },
    { 
        id: 103, 
        title: 'Смарт-квартира в центре города', 
        address: 'Киев, Печерский р-н, бул. Леси Украинки, 15',
        price: '75 000',
        area: 42,
        rooms: 1,
        floor: 12,
        totalFloors: 24,
        buildingType: 'Новостройка',
        image: 'https://img.freepik.com/free-photo/luxury-domestic-kitchen-interior_23-2150283061.jpg',
        matchPercent: 91
    }
];

// Имитация поиска с использованием ИИ
const searchWithAI = () => {
    if (selectedPreferences.value.length === 0 && !searchQuery.value) {
        toast.add({ severity: 'warn', summary: 'Внимание', detail: 'Пожалуйста, укажите ваши предпочтения или введите запрос', life: 3000 });
        return;
    }

    isSearching.value = true;
    
    // Имитация задержки запроса
    setTimeout(() => {
        matchedProperties.value = exampleResults;
        showResults.value = true;
        isSearching.value = false;
    }, 2000);
};

// Добавление/удаление предпочтения
const togglePreference = (prefId) => {
    const index = selectedPreferences.value.indexOf(prefId);
    if (index !== -1) {
        selectedPreferences.value.splice(index, 1);
    } else {
        selectedPreferences.value.push(prefId);
    }
};

// Сброс результатов поиска
const resetSearch = () => {
    showResults.value = false;
    selectedPreferences.value = [];
    searchQuery.value = '';
};
</script>

<template>
    <section class="ai-property-match py-8 px-6 lg:px-20 mx-0 lg:mx-20 my-12 bg-blue-50 rounded-xl">
        <!-- Заголовок секции -->
        <header class="text-center mb-8">
            <h2 class="text-surface-900 font-normal mb-3 text-4xl"><span class="text-primary font-medium">ИИ-подбор</span> недвижимости</h2>
            <p class="text-surface-700 text-xl max-w-4xl mx-auto">
                Наш интеллектуальный алгоритм анализирует тысячи предложений и находит именно те объекты, которые соответствуют вашим уникальным предпочтениям
            </p>
        </header>

        <div v-if="!showResults" class="card p-6 shadow-lg bg-white rounded-xl">
            <!-- Строка поиска -->
            <div class="mb-6">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search"></i>
                    <InputText v-model="searchQuery" placeholder="Опишите желаемую недвижимость своими словами..." class="w-full p-3" />
                </span>
            </div>

            <!-- Секция с предпочтениями -->
            <div class="mb-6">
                <h3 class="text-xl mb-4">Выберите важные для вас характеристики:</h3>
                <div class="flex flex-wrap gap-3">
                    <Button 
                        v-for="pref in availablePreferences" 
                        :key="pref.id"
                        :icon="pref.icon"
                        :label="pref.name"
                        :outlined="!selectedPreferences.includes(pref.id)"
                        @click="togglePreference(pref.id)"
                        :class="{ 'p-button-primary': selectedPreferences.includes(pref.id) }"
                        size="small"
                    />
                </div>
            </div>

            <!-- Кнопка поиска -->
            <div class="flex justify-center">
                <Button 
                    label="Подобрать с помощью ИИ" 
                    icon="pi pi-bolt" 
                    @click="searchWithAI" 
                    :loading="isSearching"
                    class="p-3 text-lg"
                />
            </div>
        </div>

        <!-- Результаты поиска -->
        <div v-if="showResults" class="card p-6 shadow-lg bg-white rounded-xl">
            <div class="flex justify-between mb-6">
                <h3 class="text-2xl">Идеально подходящие варианты для вас</h3>
                <Button icon="pi pi-times" text @click="resetSearch" />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="property in matchedProperties" :key="property.id" class="card p-4 border-2 hover:border-primary transition-colors">
                    <div class="relative">
                        <img :src="property.image" :alt="property.title" class="w-full h-48 object-cover rounded-lg mb-3" />
                        <div class="absolute top-2 right-2 bg-primary text-white font-bold p-2 rounded-lg">
                            {{ property.matchPercent }}% совпадение
                        </div>
                    </div>
                    <h4 class="text-lg font-bold mb-2">{{ property.title }}</h4>
                    <p class="text-sm text-surface-600 mb-2">{{ property.address }}</p>
                    <div class="flex justify-between mb-2">
                        <span class="text-surface-700"><strong>{{ property.area }} м²</strong></span>
                        <span class="text-surface-700"><strong>{{ property.rooms }} комн.</strong></span>
                        <span class="text-surface-700"><strong>{{ property.floor }}/{{ property.totalFloors }}</strong></span>
                    </div>
                    <div class="flex justify-between items-center mt-3">
                        <span class="text-primary text-xl font-bold">${{ property.price }}</span>
                        <Button label="Подробнее" severity="secondary" size="small" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Секция с преимуществами ИИ-подбора -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div class="flex flex-col items-center text-center p-4">
                <div class="flex items-center justify-center bg-blue-100 w-16 h-16 rounded-full mb-4">
                    <i class="pi pi-bolt text-3xl text-blue-600"></i>
                </div>
                <h3 class="text-lg font-medium mb-2">Мгновенный анализ</h3>
                <p class="text-surface-600">ИИ анализирует все доступные объекты и находит лучшие совпадения за секунды</p>
            </div>
            
            <div class="flex flex-col items-center text-center p-4">
                <div class="flex items-center justify-center bg-green-100 w-16 h-16 rounded-full mb-4">
                    <i class="pi pi-user text-3xl text-green-600"></i>
                </div>
                <h3 class="text-lg font-medium mb-2">Персонализация</h3>
                <p class="text-surface-600">Алгоритм учитывает ваши предпочтения и образ жизни</p>
            </div>
            
            <div class="flex flex-col items-center text-center p-4">
                <div class="flex items-center justify-center bg-yellow-100 w-16 h-16 rounded-full mb-4">
                    <i class="pi pi-check-circle text-3xl text-yellow-600"></i>
                </div>
                <h3 class="text-lg font-medium mb-2">Высокое качество</h3>
                <p class="text-surface-600">Предлагаем только проверенные и качественные объекты недвижимости</p>
            </div>
            
            <div class="flex flex-col items-center text-center p-4">
                <div class="flex items-center justify-center bg-purple-100 w-16 h-16 rounded-full mb-4">
                    <i class="pi pi-chart-line text-3xl text-purple-600"></i>
                </div>
                <h3 class="text-lg font-medium mb-2">Прогнозирование</h3>
                <p class="text-surface-600">ИИ определяет перспективные варианты с учетом динамики рынка</p>
            </div>
        </div>

        <Toast />
    </section>
</template>

<style scoped>
.ai-property-match {
    position: relative;
    overflow: hidden;
}

.ai-property-match::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background-image: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 0;
}

.ai-property-match::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 300px;
    height: 300px;
    background-image: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 0;
}
</style> 