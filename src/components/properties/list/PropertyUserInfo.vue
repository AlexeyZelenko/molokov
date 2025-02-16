<script setup>
import { defineProps } from 'vue';
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();
const user = userStore.user;

defineProps({
    creator: Object
});
</script>

<template>
    <Accordion value="1" expandIcon="pi pi-phone" collapseIcon="pi pi-angle-up">
        <AccordionPanel value="0">
            <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                    <Avatar
                        :icon="user?.avatar ? null : 'pi pi-user'"
                        :image="user?.avatar || null"
                        style="height: 35px; width: 50px"
                        shape="circle"
                    />
                    <span class="font-bold whitespace-nowrap px-2">{{ creator?.username }}</span>
                </span>
            </AccordionHeader>
            <AccordionContent>
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
