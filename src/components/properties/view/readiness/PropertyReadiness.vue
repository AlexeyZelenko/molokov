<template>
    <div v-if="property?.facilityReadiness" class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Готовність об'єкта</div>
        <div>{{ formatFirebaseTimestamp(property?.facilityReadiness) }}</div>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
import { formatFirebaseTimestamp } from '@/utils/dateUtils';

defineProps({
    property: Object
});
</script>
