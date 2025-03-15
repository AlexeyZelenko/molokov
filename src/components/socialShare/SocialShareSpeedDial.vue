<template>
    <SpeedDial
        :model="shareItems"
        buttonClassName="p-button-outlined p-button-secondary share-button"
        :hideOnClickOutside="true"
        direction="left"
        show-icon="pi pi-share-alt"
        hide-icon="pi pi-times"
        @show="$emit('show')"
        @hide="$emit('hide')"
        :mask="false"
    />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import SpeedDial from 'primevue/speeddial';

defineProps({
    shareItems: {
        type: Array,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    }
});

defineEmits(['show', 'hide']);
</script>

<style scoped>
.share-button.p-button.p-button-icon-only {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    z-index: 1999;
}

.share-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.p-speeddial) {
    z-index: 1999;
}

:deep(.p-speeddial-list) {
    z-index: 1999;
}

.p-speeddial-action {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: transform 0.2s ease;
}

.p-speeddial-action:hover {
    transform: scale(1.1);
}
</style>
