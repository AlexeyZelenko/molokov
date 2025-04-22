<script setup lang="ts">
import { computed, onMounted, ComputedRef } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useAgencyStore } from '@/store/agencyStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import VueLeafle from '@/components/maps/VueLeafle.vue';
import { useAuthStore } from '@/store/authFirebase';

// Определение типов
interface City {
  Description: string;
  AreaDescription?: string;
  Ref?: string;
}

interface Region {
  name: string;
  value?: string;
}

export interface Agency {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  region?: Region;
  city?: City;
  markerPosition?: [number, number];
  address?: string;
  phone?: string[];
  email?: string;
  agents?: number;
  objects?: number;
  creator: string;
}

const authStore = useAuthStore();
const currentUser: ComputedRef<any> = computed(() => authStore.user);

const props = defineProps<{
  agency: Agency;
}>();

const router = useRouter();
const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'edit', agency: Agency): void;
  (e: 'deleted', agencyId: string): void;
}>();

const agencyStore = useAgencyStore();
const toast = useToast();
const confirm = useConfirm();

// Форматирование телефонов для отображения
const phonesDisplay: ComputedRef<string | string[]> = computed(() => {
  if (!props.agency.phone || !props.agency.phone.length) return 'Не вказано';
  return props.agency.phone;
});

// Позиция маркера на карте
const markerPositionDisplay: ComputedRef<string> = computed(() => {
  return Array.isArray(props.agency.markerPosition) && props.agency.markerPosition.length === 2
    ? `${props.agency.markerPosition[0]}, ${props.agency.markerPosition[1]}`
    : 'Не вказано';
});

// Редактирование агентства
const editAgency = (): void => {
  router.push({
    name: 'agencies-register',
    params: { id: props.agency.id }
  });
  emit('edit', props.agency);
};

// Удаление агентства с подтверждением
const confirmDeleteAgency = (): void => {
  confirm.require({
    message: `Ви впевнені, що хочете видалити агентство "${props.agency.name}"?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Так, видалити',
    rejectLabel: 'Ні, скасувати',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: deleteAgency,
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Скасовано',
        detail: 'Видалення скасовано.',
        life: 3000
      });
    }
  });
};

// Функция удаления агентства
const deleteAgency = async (): Promise<void> => {
  try {
    await agencyStore.deleteAgency(props.agency.id);
    toast.add({
      severity: 'success',
      summary: 'Успіх',
      detail: `Агентство "${props.agency.name}" видалено.`,
      life: 3000
    });
    emit('deleted', props.agency.id);
    await router.push({ name: 'agenciesList' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error deleting agency:', error);
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: `Не вдалося видалити агентство: ${errorMessage}`,
      life: 5000
    });
  }
};

onMounted(() => {
  // Используем метод getCurrentUser только если он необходим
  if (!currentUser.value) {
    authStore.getCurrentUser();
  }
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Кнопка возврата -->
        <Button label="Назад до списку" icon="pi pi-arrow-left" class="mb-6 p-button-text p-button-plain" @click="$emit('back')" />

        <Card class="shadow-lg">
            <template #title>
                <h2 class="text-3xl font-bold text-blue-800">{{ agency.name }}</h2>
            </template>

            <template #content>
                <img v-if="agency.logoUrl" :src="agency.logoUrl" alt="Логотип агентства" class="h-24 w-24 rounded-full float-left mr-4 mb-4" />
                
                <div class="space-y-3 text-gray-700 text-lg">
                    <!-- Информация об агентстве -->
                    <div v-if="agency.website" class="flex items-start">
                        <i class="pi pi-globe mr-2 text-blue-500 mt-1"></i>
                        <div>
                            <strong>Вебсайт:</strong> 
                            <a :href="agency.website" target="_blank" class="text-blue-600 hover:underline">{{ agency.website }}</a>
                        </div>
                    </div>

                    <div v-if="agency.region?.name" class="flex items-start">
                        <i class="pi pi-map mr-2 text-indigo-500 mt-1"></i>
                        <div><strong>Область:</strong> {{ agency.region.name }}</div>
                    </div>

                    <div v-if="agency.city?.Description" class="flex items-start">
                        <i class="pi pi-map-marker mr-2 text-green-500 mt-1"></i>
                        <div>
                            <strong>Місто:</strong> {{ agency.city.Description }}
                            <span v-if="agency.city.AreaDescription">({{ agency.city.AreaDescription }})</span>
                        </div>
                    </div>

                    <div v-if="markerPositionDisplay !== 'Не вказано'" class="flex items-start">
                        <i class="pi pi-compass mr-2 text-teal-500 mt-1"></i>
                        <div><strong>Координати:</strong> {{ markerPositionDisplay }}</div>
                    </div>

                    <div v-if="agency.address" class="flex items-start">
                        <i class="pi pi-home mr-2 text-orange-500 mt-1"></i>
                        <div><strong>Адреса:</strong> {{ agency.address }}</div>
                    </div>

                    <template v-if="Array.isArray(agency.phone) && agency.phone.length">
                        <div v-for="(phone, index) in agency.phone" :key="index" class="flex items-start">
                            <i class="pi pi-phone mr-2 text-yellow-500 mt-1"></i>
                            <div><strong>Телефон:</strong> {{ phone }}</div>
                        </div>
                    </template>

                    <div v-if="agency.email" class="flex items-start">
                        <i class="pi pi-envelope mr-2 text-pink-500 mt-1"></i>
                        <div><strong>Email:</strong> {{ agency.email }}</div>
                    </div>

                    <div v-if="agency.agents !== undefined" class="flex items-start">
                        <i class="pi pi-users mr-2 text-purple-500 mt-1"></i>
                        <div><strong>Кількість агентів:</strong> {{ agency.agents }}</div>
                    </div>

                    <div v-if="agency.objects !== undefined" class="flex items-start">
                        <i class="pi pi-building mr-2 text-purple-500 mt-1"></i>
                        <div><strong>Кількість об'єктів:</strong> {{ agency.objects }}</div>
                    </div>
                </div>

                <!-- Карта -->
                <VueLeafle 
                    v-if="agency?.markerPosition && Array.isArray(agency.markerPosition) && agency.markerPosition.length === 2"
                    :centerMap="agency.markerPosition" 
                    v-model:marker="agency.markerPosition" 
                    class="mt-6 h-72 w-full" 
                />
            </template>

            <template #footer>                
                <div v-if=" currentUser?.uid === agency.creator" class="flex justify-end gap-3">
                    <Button label="Редагувати" icon="pi pi-pencil" class="p-button-primary" @click="editAgency" />
                    <Button label="Видалити" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAgency" />
                </div>
            </template>
        </Card>
    </div>
</template>