<script setup>
import {defineProps, onMounted} from "vue";

const props = defineProps({
    utilities: Object,
});

onMounted(() => {
    console.log('UtilitiesList.vue mounted', props.utilities)
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Комунальні послуги</div>
        <ul>
            <li
                v-for="utility in Object.values(props.utilities)"
                :key="utility.code"
            >
                {{ utility.name }}
            </li>
        </ul>
    </div>
</template>
