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

<template>
    <div class="card shadow-lg">
        <Galleria
            :value="images"
            :responsiveOptions="responsiveOptions"
            :numVisible="5"
            containerStyle="max-width: 640px; border: none"
        >
            <template #item="slotProps">
                <Image
                    :src="slotProps.item.url || slotProps.item"
                    :alt="slotProps.item.title"
                    preview
                    :imageStyle="{
                        maxWidth: '100%',
                        height: '400px',
                        objectFit: 'contain'
                    }"
                    :previewIcon="'pi pi-search'"
                    :zoomInDisabled="false"
                    :zoomOutDisabled="false"
                />
            </template>
            <template #thumbnail="slotProps">
                <img
                    :src="slotProps.item.url || slotProps.item"
                    :alt="slotProps.item.title"
                    width="100" style="height: 65px; object-fit: cover; padding: 0 5px" />
            </template>
        </Galleria>
    </div>
</template>
