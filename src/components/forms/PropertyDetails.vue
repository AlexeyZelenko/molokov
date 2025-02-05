<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Комунікації</div>
        <Textarea v-model="modelValue.communications" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

        <div class="font-semibold text-xl">Інфраструктура</div>
        <Textarea v-model="modelValue.infrastructure" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

        <div class="font-semibold text-xl">Ландшафт</div>
        <Textarea v-model="modelValue.landscape" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
    get: () => props.modelValue,
    set: (newValue) => emit("update:modelValue", newValue)
});
</script>
