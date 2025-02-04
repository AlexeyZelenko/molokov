<script setup>
const props = defineProps({
    layout: String
});

const emit = defineEmits(['update:layout']);
const options = ['list', 'grid'];
</script>

<template>
    <div class="flex justify-end">
        <SelectButton
            :model-value="layout"
            :options="options"
            :allowEmpty="false"
            @update:modelValue="emit('update:layout', $event)"
        >
            <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
        </SelectButton>
    </div>
</template>
