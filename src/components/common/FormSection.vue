<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">{{ title }}</div>

        <template v-if="type === 'multi'">
            <MultiSelect
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
                :options="options"
                optionLabel="name"
                :placeholder="title"
                :filter="true"
            />
        </template>

        <template v-else-if="type === 'toggle'">
            <ToggleButton
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
                onLabel="Так"
                offLabel="Ні"
                :style="{ width: '10em' }"
            />
            <div v-if="modelValue" class="text-3xl mt-2">
                🐶 🐱 🐰 🦜 🐠
            </div>
        </template>

        <template v-else-if="type === 'date'">
            <DatePicker
                :showIcon="true"
                :showButtonBar="true"
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
            />
        </template>

        <template v-else>
            <Select
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
                :options="options"
                optionLabel="name"
                :placeholder="title"
            />
        </template>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    modelValue: [Object, Array, String, Boolean, Date],
    options: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: 'single',
        validator: (value) => ['single', 'multi', 'toggle', 'date'].includes(value)
    }
});

defineEmits(['update:modelValue']);
</script>
