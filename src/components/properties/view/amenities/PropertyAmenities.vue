<template>
    <div class="flex flex-col gap-2">
        <div class="hidden md:block">
            <Tabs value="0">
                <TabList class="flex flex-col">
                    <Tab
                        v-for="tab in tabs"
                        :key="tab.title"
                        :value="tab.value"
                        class="font-bold text-xl"
                    >
                        <span>{{ tab.title }}</span>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in tabs" :key="tab.content" :value="tab.value">
                        <p class="m-0">{{ tab.content }}</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>

        <Accordion value="0" class="block md:hidden">
            <AccordionPanel v-for="tab in tabs" :key="tab.title" :value="tab.value">
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

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
    property: {
        type: Object,
        default: () => ({})
    }
});

const tabs = ref([
    { title: 'Комунікації', content: props.property.communications, value: '0' },
    { title: 'Інфраструктура', content: props.property.infrastructure, value: '1' },
    { title: 'Ландшафт', content: props.property.landscape, value: '2' }
]);
</script>
