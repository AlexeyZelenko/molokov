<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
    price: Number,
    subcategory: Object,
    isDisplayUAH: {
        type: Boolean,
        default: false,
    }
});

const exchangeRate = ref(null);
const priceUSD = ref(null);
const priceUAH = ref(null);
const loading = ref(false);
const error = ref(null);

// Функция получения курса валют
const fetchExchangeRate = async () => {
    try {
        loading.value = true;
        error.value = null;

        // Используем бесплатный API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        // Получаем курс UAH к USD
        exchangeRate.value = data.rates.UAH;

        // Обновляем цены
        updatePrices();
    } catch (err) {
        error.value = 'Помилка отримання курсу валют';
        console.error('Error fetching exchange rate:', err);
    } finally {
        loading.value = false;
    }
};

// Функция обновления цен
const updatePrices = () => {
    if (!props.price || !exchangeRate.value) return;

    priceUAH.value = props.price;
    priceUSD.value = +(props.price / exchangeRate.value).toFixed(0);
};

// Следим за изменениями цены
watch(() => props.price, () => {
    updatePrices();
});

// Получаем курс при монтировании компонента
onMounted(() => {
    fetchExchangeRate();

    // Обновляем курс каждый час
    const interval = setInterval(fetchExchangeRate, 3600000);

    // Очищаем интервал при размонтировании
    onUnmounted(() => clearInterval(interval));
});
</script>

<template>
    <div class="price-converter">
        <!-- Загрузка -->
        <div v-if="loading" class="text-gray-500">
            Завантаження курсу валют...
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="text-red-500">
            {{ error }}
        </div>

        <!-- Цены -->
        <div v-else class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <span v-if="isDisplayUAH && priceUAH">₴ {{ priceUAH }} /</span>
                <span v-if="priceUSD">$ {{ priceUSD }}</span>
            </div>
            <div class="text-sm text-gray-500">
                Курс: 1 USD = {{ exchangeRate }} UAH
            </div>
        </div>
    </div>
</template>
