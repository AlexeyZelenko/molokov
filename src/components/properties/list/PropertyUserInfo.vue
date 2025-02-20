<script setup>
import { defineProps, onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();

const props = defineProps({
    creator: Object
});

const users = ref([]);
const owner = computed(() => users.value.find(user => user.id === props.creator.id));

onMounted(async () => {
    users.value = await authStore.getUsers();
});
</script>

<template>
    <Accordion v-if="owner" value="1" expandIcon="pi pi-phone" collapseIcon="pi pi-angle-up">
        <AccordionPanel value="0">
            <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                    <Avatar
                        :icon="owner?.avatar ? null : 'pi pi-user'"
                        :image="owner?.avatar || null"
                        style="height: 35px; width: 35px; background: none"
                        shape="circle"
                    />
                    <span class="font-bold whitespace-nowrap px-3">{{ owner?.name }}</span>
                </span>
            </AccordionHeader>
            <AccordionContent v-if="owner?.phones && owner.phones.length > 0">
                <div v-for="(phone, i) in owner.phones"
                     :key="i"
                     class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                    <i class="pi pi-phone mr-2"></i>
                    {{ phone }}
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>
