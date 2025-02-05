<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Комунікації</div>
        <Textarea
            v-model="modelValue.communications"
            placeholder="Your Message"
            :autoResize="true"
            rows="3"
            cols="30"
        />

        <div class="font-semibold text-xl">Інфраструктура</div>
        <Textarea
            v-model="modelValue.infrastructure"
            placeholder="Your Message"
            :autoResize="true"
            rows="3"
            cols="30"
        />

        <div class="font-semibold text-xl">Ландшафт</div>
        <Textarea
            v-model="modelValue.landscape"
            placeholder="Your Message"
            :autoResize="true"
            rows="3"
            cols="30"
        />
    </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const communications = computed({
    get: () => props.modelValue.communications,
    set: (value) => emit('update:modelValue', {...props.modelValue, communications: value})
});

const infrastructure = computed({
    get: () => props.modelValue.infrastructure,
    set: (value) => emit('update:modelValue', {...props.modelValue, infrastructure: value})
});

const landscape = computed({
    get: () => props.modelValue.landscape,
    set: (value) => emit('update:modelValue', {...props.modelValue, landscape: value})
});
</script>
