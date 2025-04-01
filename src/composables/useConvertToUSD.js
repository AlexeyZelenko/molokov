import { computed } from 'vue';

export function useConvertToUSD(price, currency, exchangeRates) {
    const priceUSD = computed(() => {
        if (!price || !currency || !exchangeRates.value) return null;

        const rate = exchangeRates.value[currency];
        if (!rate) return null;

        if (currency === 'USD') {
            return price;
        }

        if (currency === 'UAH' || currency === 'EUR') {
            return +(price / rate).toFixed(2);
        }

        return null;
    });

    return { priceUSD };
}
