<script setup>
import { computed } from 'vue'; // Keep ref, computed if needed, but might not be
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag'; // Keep if used in footer/content for tags
import { useRouter } from 'vue-router'; // Import router for navigation
// InputText, Dropdown not needed in details view
// import InputText from 'primevue/inputtext';
// import Dropdown from 'primevue/dropdown';

import { defineProps, defineEmits } from 'vue';
import { useAgencyStore } from '@/store/agencyStore'; // Import agency store
import { useToast } from 'primevue/usetoast'; // Import toast
import { useConfirm } from 'primevue/useconfirm';
import VueLeafle from "@/components/maps/VueLeafle.vue"; // Import confirm service

const props = defineProps({
    agency: {
        type: Object,
        required: true
    }
});

// Use router for navigation
const router = useRouter();

// Define emitted events: back (already there), edit, deleted
const emit = defineEmits(['back', 'edit', 'deleted']);

// Get store, toast, and confirm service instances
const agencyStore = useAgencyStore();
const toast = useToast();
const confirm = useConfirm();

// Function to handle editing
const editAgency = () => {
    // Emit 'edit' event, passing the agency object to the parent
    router.push({
        name: 'agencies-register', // Ensure this matches your route name
        props: {
            agency: props.agency // Pass the agency object as a prop
        }
    }); // Redirect to edit page
    emit('edit', props.agency);
};

// Function to handle delete confirmation
const confirmDeleteAgency = () => {
    confirm.require({
        message: `Ви впевнені, що хочете видалити агентство "${props.agency.name}"?`,
        header: 'Підтвердження видалення',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Так, видалити',
        rejectLabel: 'Ні, скасувати',
        acceptClass: 'p-button-danger', // Style for the accept button
        rejectClass: 'p-button-secondary', // Style for the reject button

        accept: async () => {
            // Callback function if user confirms deletion
            try {
                // Call the delete action from the store
                await agencyStore.deleteAgency(props.agency.id);
                toast.add({
                    severity: 'success',
                    summary: 'Успіх',
                    detail: `Агентство "${props.agency.name}" видалено.`,
                    life: 3000
                });
                await router.push({ name: 'agenciesList' });
            } catch (error) {
                console.error('Error deleting agency:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: `Не вдалося видалити агентство: ${error.message || error}`,
                    life: 5000
                });
            }
        },
        reject: () => {
            // Callback function if user cancels deletion (optional)
            toast.add({
                severity: 'info',
                summary: 'Скасовано',
                detail: 'Видалення скасовано.',
                life: 3000
            });
        }
    });
};

// Computed property to display phones as a single string
const phonesDisplay = computed(() => {
    // Check if agency.phone is an array and not empty
    return Array.isArray(props.agency.phone) && props.agency.phone.length > 0
        ? props.agency.phone.join(', ') // Join array elements with comma and space
        : 'Не вказано';
});

// Computed property to display marker position as a string
const markerPositionDisplay = computed(() => {
    // Check if agency.markerPosition is an array with 2 elements
    return Array.isArray(props.agency.markerPosition) && props.agency.markerPosition.length === 2
        ? `${props.agency.markerPosition[0]}, ${props.agency.markerPosition[1]}` // Format as "lat, lng"
        : 'Не вказано';
});
</script>

<template>
    <!--     Ensure <ConfirmDialog /> is included in the parent component using this view -->
    <ConfirmDialog></ConfirmDialog>
    <Toast />

    <div class="container mx-auto px-4 py-8">
        <!-- Back button -->
        <Button label="Назад до списку" icon="pi pi-arrow-left" class="mb-6 p-button-text p-button-plain" @click="$emit('back')" />

        <Card class="shadow-lg">
            <template #title>
                <!-- Display agency name -->
                <h2 class="text-3xl font-bold text-blue-800">{{ agency.name }}</h2>
            </template>

            <template #content>
                <img
                    v-if="agency.logoUrl"
                    :src="agency.logoUrl"
                    alt="Логотип агентства"
                    class="h-24 w-24 rounded-full float-left mr-4 mb-4"
                />
                <!-- Display all relevant fields -->
                <div class="space-y-3 text-gray-700 text-lg">
                    <!-- Website -->
                    <div v-if="agency.website">
                        <i class="pi pi-globe mr-2 text-blue-500"></i>
                        <strong>Вебсайт:</strong> <a :href="agency.website" target="_blank" class="text-blue-600 hover:underline">{{ agency.website }}</a>
                    </div>

                    <!-- Region -->
                    <div v-if="agency.region?.name">
                        <i class="pi pi-map mr-2 text-indigo-500"></i>
                        <strong>Область:</strong> {{ agency.region.name }}
                    </div>

                    <!-- City -->
                    <div v-if="agency.city?.Description">
                        <i class="pi pi-map-marker mr-2 text-green-500"></i>
                        <strong>Місто:</strong> {{ agency.city.Description }}
                        <span v-if="agency.city.AreaDescription">({{ agency.city.AreaDescription }})</span>
                    </div>

                    <!-- Map Position / Coordinates -->
                    <div v-if="markerPositionDisplay !== 'Не вказано'">
                        <i class="pi pi-compass mr-2 text-teal-500"></i>
                        <strong>Координати:</strong> {{ markerPositionDisplay }}
                    </div>

                    <!-- Address -->
                    <div v-if="agency.address">
                        <i class="pi pi-home mr-2 text-orange-500"></i>
                        <strong>Адреса (вулиця/будинок):</strong> {{ agency.address }}
                    </div>

                    <!-- Phones -->
                    <div>
                        <i class="pi pi-phone mr-2 text-yellow-500"></i>
                        <strong>Телефон(и):</strong> {{ phonesDisplay }}
                    </div>

                    <!-- Email -->
                    <div v-if="agency.email">
                        <i class="pi pi-envelope mr-2 text-pink-500"></i>
                        <strong>Email:</strong> {{ agency.email }}
                    </div>

                    <!-- Agents count - if applicable -->
                    <!-- Assuming 'agents' might not be directly on the agency object -->
                    <div v-if="agency.agents !== undefined && agency.agents !== null">
                        <i class="pi pi-users mr-2 text-purple-500"></i>
                        <strong>Кількість агентів:</strong> {{ agency.agents }}
                    </div>
                    <div v-if="agency.objects !== undefined && agency.objects !== null">
                        <i class="pi pi-home mr-2 text-purple-500"></i>
                        <strong>Кількість об'єктів:</strong> {{ agency.objects }}
                    </div>
                    <!-- Or display a placeholder/calculated value if needed -->
                </div>

                <VueLeafle
                    :centerMap="agency.markerPosition"
                    v-model:marker="agency.markerPosition"
                    style="height: 300px; width: 100%; margin-top: 20px" />
            </template>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <!-- Edit button -->
                    <Button label="Редагувати" icon="pi pi-pencil" class="p-button-primary p-button-sm" @click="editAgency" />

                    <!-- Delete button -->
                    <Button label="Видалити" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="confirmDeleteAgency" />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
/* Ваші стилі тут */
</style>
