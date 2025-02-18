<script setup>
import List from '@/components/properties/list/List.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
onMounted(() => {
    if (route.query?.user) {
        console.log('Page:', route.query);
    }
});

</script>

<template>
    <List
        :type="'sell'"
        :category="'apartments'"
        :userId="route?.query?.user"
    />
</template>

<style scoped lang="scss">
</style>
