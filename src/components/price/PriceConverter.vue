<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useApartmentsStore } from "@/store/apartments";

const useApartments = useApartmentsStore();

const displayCurrency = computed(() => {
    return useApartments.getDisplayCurrency.map(currency => currency.value);
});

const props = defineProps({
    price: Number,
    subcategory: Object,
});

const exchangeRate = ref(null);
const priceUSD = ref(null);
const priceUAH = ref(null);
const priceEUR = ref(null);
const loading = ref(false);
const error = ref(null);

// Currency conversion state
const sourceCurrency = ref('UAH'); // Default source currency
const targetCurrency = ref('USD'); // Default target currency
const amountToConvert = ref(0); // Amount to convert
const convertedAmount = ref(0); // Result of conversion

// Функция получения курса валют
const fetchExchangeRate = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
            throw new Error('Не вдалося отримати курс валют');
        }

        const data = await response.json();
        if (!data.rates) {
            throw new Error('Невірний формат відповіді API');
        }

        exchangeRate.value = {
            UAH: data.rates.UAH,
            EUR: data.rates.EUR,
            USD: 1 // USD is the base currency
        };

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

    priceUSD.value = props.price;
    priceUAH.value = +(props.price * exchangeRate.value.UAH).toFixed(0);
    priceEUR.value = +(props.price * exchangeRate.value.EUR).toFixed(2);
};

// Следим за изменениями цены и курса
watch([() => props.price, () => exchangeRate.value], () => {
    updatePrices();
});

// Функция конвертации валюты
const convertCurrency = () => {
    if (!exchangeRate.value) {
        error.value = 'Курс валют недоступний';
        return;
    }

    const sourceRate = exchangeRate.value[sourceCurrency.value];
    const targetRate = exchangeRate.value[targetCurrency.value];

    if (!sourceRate || !targetRate) {
        error.value = 'Невірна валюта для конвертації';
        return;
    }

    // Convert the amount
    convertedAmount.value = +((amountToConvert.value / sourceRate) * targetRate).toFixed(2);
};

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};

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
        <div v-show="loading" class="text-gray-500">
            Завантаження курсу валют...
        </div>

        <!-- Ошибка -->
        <div v-show="error" class="text-red-500">
            {{ error }}
        </div>

        <!-- Цены -->
        <div v-if="!loading && !error" class="flex" :key="priceUSD">
            <div class="flex items-center gap-2">
                <span v-if="priceUAH && displayCurrency.includes('UAH')">₴ {{ priceUAH }} </span>
                <span v-if="priceUSD && displayCurrency.includes('USD')">$ {{ priceUSD }} </span>
                <span v-if="priceEUR && displayCurrency.includes('EUR')">€ {{ priceEUR }} </span>
            </div>
            <div class="flex justify-end">
                <Button icon="pi pi-undo" severity="contrast" variant="text" aria-label="Star" @click="toggle" />

                <Popover ref="op">
                    <div v-if="exchangeRate" class="flex flex-col gap-4 w-[16rem]">
                        <!-- Курс валют -->
                        <div class="font-semibold text-xl">Курс валют</div>
                        <div class="flex justify-between">
                            <span>USD</span>
                            <span>1</span>
                        </div>
                        <div class="flex justify-between">
                            <span>UAH</span>
                            <span>{{ exchangeRate.UAH }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>EUR</span>
                            <span>{{ exchangeRate.EUR }}</span>
                        </div>

                        <!-- Конвертер валют -->
                        <div class="font-semibold text-xl mt-4">Конвертер</div>
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-col gap-1">
                                <label for="sourceCurrency">З:</label>
                                <Dropdown
                                    v-model="sourceCurrency"
                                    :options="['UAH', 'USD', 'EUR']"
                                    placeholder="Оберіть валюту"
                                />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label for="targetCurrency">В:</label>
                                <Dropdown
                                    v-model="targetCurrency"
                                    :options="['UAH', 'USD', 'EUR']"
                                    placeholder="Оберіть валюту"
                                />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label for="amountToConvert">Сума:</label>
                                <InputNumber
                                    v-model="amountToConvert"
                                    mode="decimal"
                                    :min="0"
                                    placeholder="Введіть суму"
                                />
                            </div>
                            <Button label="Конвертувати" @click="convertCurrency" />
                        </div>

                        <!-- Результат конвертації -->
                        <div v-if="convertedAmount" class="mt-2">
                            <div class="font-bold">Результат:</div>
                            <div class="font-semibold">{{ amountToConvert }} {{ sourceCurrency }} = {{ convertedAmount }} {{ targetCurrency }}</div>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-500">
                        Курс валют недоступний
                    </div>
                </Popover>
            </div>
        </div>
    </div>
</template>
