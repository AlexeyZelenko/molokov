<script setup>
defineProps({
    creator: Object
});
</script>

<template>
    <Accordion value="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
        <AccordionPanel value="0">
            <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                    <Avatar icon="pi pi-user"
                            style="background-color: #dee9fc; color: #1a2551"
                            shape="circle" />
                    <span class="font-bold whitespace-nowrap px-2">Користувач</span>
                </span>
            </AccordionHeader>
            <AccordionContent>
                <div class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                    <i class="pi pi-user mr-2"></i>
                    {{ creator?.username }}
                </div>
                <div v-for="(phone, i) in creator?.phone"
                     :key="i"
                     class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                    <i class="pi pi-phone mr-2"></i>
                    {{ phone }}
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
