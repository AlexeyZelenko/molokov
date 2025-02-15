<script setup>
const props = defineProps({
    layout: String
});

const emit = defineEmits(['update:layout']);
const options = ['list', 'grid', 'map'];
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
                <i
                    :class="{
                        'pi pi-bars': option === 'list',
                        'pi pi-th-large': option === 'grid',
                        'pi pi-map-marker': option === 'map'
                    }"
                />
            </template>
        </SelectButton>
    </div>
</template>
