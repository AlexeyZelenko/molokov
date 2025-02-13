<template>
    <Fluid class="flex flex-col mt-8 shadow-lg">
        <div class="card flex flex-col gap-4 w-full">
            <Accordion value="0">
                <AccordionPanel>
                    <AccordionHeader>
                        <span class="font-semibold text-xl">Додадковий опис об'єкта</span>
                    </AccordionHeader>
                    <AccordionContent>
                        <p class="m-0" v-html="description"></p>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </Fluid>
</template>

<script setup>
defineProps({
    description: {
        type: String,
        default: ''
    }
});
</script>
