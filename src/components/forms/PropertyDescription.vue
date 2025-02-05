<template>
    <div class="card flex flex-col gap-4 w-full">
        <div class="flex flex-col md:flex-row gap-4">
            <div class="font-semibold text-xl">Додатковий опис об'єкта</div>
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
