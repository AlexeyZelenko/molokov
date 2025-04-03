<script setup>
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
    property: {
        type: Object,
        default: () => ({})
    }
});

// Исходный массив вкладок
const tabs = ref([
    { title: 'Комунікації', content: props.property.communications, value: '0' },
    { title: 'Інфраструктура', content: props.property.infrastructure, value: '1' },
    { title: 'Ландшафт', content: props.property.landscape, value: '2' }
]);

// Фильтруем вкладки, убирая пустые значения
const filteredTabs = computed(() => {
    return tabs.value.filter((tab) => tab.content && tab.content.trim() !== '');
});
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="hidden md:block">
            <Tabs v-if="filteredTabs?.length" value="0">
                <TabList class="flex flex-col">
                    <Tab v-for="tab in filteredTabs" :key="tab.title" :value="tab.value" class="font-bold text-xl">
                        <span>{{ tab.title }}</span>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in filteredTabs" :key="tab.content" :value="tab.value">
                        <p class="m-0">{{ tab.content }}</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>

        <Accordion v-if="filteredTabs.length" value="0" class="block md:hidden">
            <AccordionPanel v-for="tab in filteredTabs" :key="tab.title" :value="tab.value">
                <AccordionHeader>
                    <span class="font-semibold text-md">{{ tab.title }}</span>
                </AccordionHeader>
                <AccordionContent>
                    <p class="m-0">{{ tab.content }}</p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>
