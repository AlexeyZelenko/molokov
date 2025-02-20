<template>
    <div class="card flex flex-col items-center gap-4 w-full">
        <div class="font-semibold text-xl">Додатковий опис об'єкта</div>
        <div class="flex flex-col md:flex-row gap-4">
            <Editor
                v-model="description"
                editorStyle="height: 320px"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const description = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
</script>
