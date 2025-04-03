// composables/usePriceInUSD.js
import { ref, computed } from 'vue';

export function usePriceInUSD() {
    const exchangeRates = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const convertToUSD = async (amount, fromCurrency) => {
        if (fromCurrency === 'USD') return amount;
        if (!exchangeRates.value?.[fromCurrency]) {
            throw new Error(`Exchange rate for ${fromCurrency} not available`);
        }
        return amount / exchangeRates.value[fromCurrency];
    };

    const convertFromUSD = async (amount, toCurrency) => {
        if (toCurrency === 'USD') return amount;
        if (!exchangeRates.value?.[toCurrency]) {
            throw new Error(`Exchange rate for ${toCurrency} not available`);
        }
        return amount * exchangeRates.value[toCurrency];
    };

    const fetchExchangeRate = async () => {
        try {
            loading.value = true;
            error.value = null;

            // Здесь должен быть реальный API запрос
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();

            exchangeRates.value = {
                UAH: data.rates.UAH,
                EUR: data.rates.EUR,
                USD: 1
            };
        } catch (err) {
            error.value = 'Failed to fetch exchange rates';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        exchangeRates: computed(() => exchangeRates.value),
        fetchExchangeRate,
        convertToUSD,
        convertFromUSD
    };
}
