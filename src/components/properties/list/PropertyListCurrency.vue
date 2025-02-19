<script setup>
import { ref } from 'vue';
import { useApartmentsStore} from "@/store/apartments";

const store = useApartmentsStore();

const options = ref([
    { name: '$', value: 'USD' },
    { name: '€', value: 'EUR' },
    { name: '₴', value: 'UAH' }
]);
const listCurrency = ref([{ name: '$', value: 'USD' }]);

const updateDisplayCurrency = () => {
    store.setCurrencies(listCurrency.value);
};
</script>

<template>
    <div class="flex justify-end m-0 p-0">
        <div class="flex justify-center">
            <SelectButton
                v-model="listCurrency"
                :options="options"
                optionLabel="name"
                multiple
                aria-labelledby="multiple"
                @change="updateDisplayCurrency"
            />
        </div>
    </div>
</template>
