<template>
    <div class="custom-galleria">
        <Galleria
            :value="images"
            :responsiveOptions="options.responsiveOptions"
            :numVisible="options.numVisible"
            :circular="options.circular"
            :showItemNavigators="options.showItemNavigators"
            :showThumbnails="options.showThumbnails"
        >
            <template #item="slotProps">
                <img
                    :src="slotProps.item.itemImageSrc"
                    :alt="slotProps.item.alt"
                    class="w-full block"
                    loading="lazy"
                />
            </template>
            <template #caption="slotProps">
                <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
                <p class="text-white">{{ slotProps.item.alt }}</p>
            </template>
        </Galleria>
    </div>
</template>

<script setup>
defineProps({
    images: {
        type: Array,
        required: true
    },
    options: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.custom-galleria {
    width: 100%;
    height: 100%;
}
</style>
