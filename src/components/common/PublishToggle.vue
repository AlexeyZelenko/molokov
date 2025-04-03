<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const publishStatus = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
</script>

<template>
    <div class="flex items-center">
        <div class="font-semibold text-xl mr-2">Опублікувати</div>
        <ToggleSwitch v-model="publishStatus" />
    </div>
</template>
