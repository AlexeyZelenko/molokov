<template>
    <div class="card">
        <Galleria
            :value="images"
            :responsiveOptions="responsiveOptions"
            :numVisible="5"
            containerStyle="max-width: 640px"
        >
            <template #item="slotProps">
                <Image
                    :src="slotProps.item"
                    :alt="slotProps.item.title"
                    preview
                    style="margin: 0 auto; max-height: 400px"
                />
            </template>
            <template #thumbnail="slotProps">
                <img
                    :src="slotProps.item"
                    :alt="slotProps.item.title"
                    width="100"
                    style="height: 65px; padding: 0 5px"
                />
            </template>
        </Galleria>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { galleriaResponsiveOptions } from './constants';

defineProps({
    images: {
        type: Array,
        required: true
    }
});

const responsiveOptions = ref(galleriaResponsiveOptions);
</script>
