<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { usePriceInUSD } from '@/composables/usePriceInUSD';

const props = defineProps({
    modelValue: {
        // Всегда получаем USD значение
        type: [Number, null],
        required: true,
        default: 0
    },
    error: {
        type: String,
        default: ''
    },
    fractionDigits: {
        type: Number,
        default: 2
    }
});

const emit = defineEmits(['update:modelValue']);

const currencyOptions = [
    { name: '$', value: 'USD' },
    { name: '€', value: 'EUR' },
    { name: 'грн', value: 'UAH' }
];
const selectedCurrency = ref(currencyOptions[0]);

const localPrice = ref(0); // Локальное значение в выбранной валюте

const { loading, error: exchangeError, fetchExchangeRate, convertFromUSD, convertToUSD } = usePriceInUSD(selectedCurrency);

// Инициализируем локальную цену на основе USD значения из props
const initLocalPrice = async () => {
    try {
        if (props.modelValue === null) return;

        if (selectedCurrency.value.value === 'USD') {
            localPrice.value = props.modelValue;
        } else {
            localPrice.value = await convertFromUSD(props.modelValue, selectedCurrency.value.value);
        }
    } catch (error) {
        console.error('Error initializing local price:', error);
    }
};

// Конвертируем локальную цену в USD и отправляем родителю
const updateUSDValue = async () => {
    try {
        const usdValue = await convertToUSD(localPrice.value, selectedCurrency.value.value);
        emit('update:modelValue', usdValue);
    } catch (error) {
        console.error('Error updating USD value:', error);
    }
};

onMounted(async () => {
    try {
        await fetchExchangeRate();
        await initLocalPrice();
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
    }
});

const handleCurrencyChange = async (event) => {
    const newCurrency = event.value;

    try {
        // Конвертируем текущее USD значение в новую валюту
        const usdValue = props.modelValue ?? 0;
        if (newCurrency.value === 'USD') {
            localPrice.value = usdValue;
        } else {
            localPrice.value = await convertFromUSD(usdValue, newCurrency.value);
        }

        selectedCurrency.value = newCurrency;
    } catch (error) {
        console.error('Currency change error:', error);
    }
};

// Отслеживаем изменения локальной цены
watch(localPrice, () => {
    updateUSDValue();
});

// Синхронизация с внешними изменениями modelValue (USD)
watch(
    () => props.modelValue,
    async (newValue) => {
        if (selectedCurrency.value.value === 'USD') {
            // Исправлено с newCurrency на selectedCurrency
            localPrice.value = newValue ?? 0;
        } else {
            localPrice.value = await convertFromUSD(newValue ?? 0, selectedCurrency.value.value);
        }
    },
    { immediate: true }
);

watch(exchangeError, (error) => {
    if (error) {
        console.error('Exchange rate error:', error);
    }
});

// Форматированное отображение USD цены
const formattedUSD = computed(() => {
    return (
        props.modelValue?.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: props.fractionDigits,
            maximumFractionDigits: props.fractionDigits
        }) ?? ''
    );
});
</script>

<template>
    <div class="price-input">
        <div class="flex justify-between mb-2">
            <div class="font-semibold text-xl">
                <span>Вартість</span>
                <span class="ml-1 text-red-500">*</span>
            </div>
            <div class="flex justify-center">
                <SelectButton v-model="selectedCurrency" :options="currencyOptions" optionLabel="name" @change="handleCurrencyChange" :disabled="loading" />
            </div>
        </div>

        <InputGroup>
            <InputGroupAddon>{{ selectedCurrency.name }}</InputGroupAddon>
            <InputNumber v-model="localPrice" :class="{ 'p-invalid': error }" showButtons mode="decimal" :min="0" :maxFractionDigits="fractionDigits" required :disabled="loading" />
            <InputGroupAddon v-if="fractionDigits > 0"> .{{ '0'.repeat(fractionDigits) }} </InputGroupAddon>
        </InputGroup>

        <small v-if="error" class="text-red-500">
            {{ error }}
        </small>

        <div v-if="loading" class="mt-2 text-gray-500">Завантаження курсів...</div>

        <div v-else-if="exchangeError" class="mt-2 text-red-500">Помилка завантаження курсів валют</div>

        <div v-if="formattedUSD" class="mt-2 text-sm text-gray-600">≈ {{ formattedUSD }} USD</div>
    </div>
</template>

<style scoped>
.price-input {
    @apply w-full;
}

.p-invalid {
    border-color: #dc3545 !important;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.p-inputnumber.p-invalid .p-inputnumber-input {
    border-color: #dc3545 !important;
}
</style>
