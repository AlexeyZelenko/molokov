<template>
    <h1 class="my-2">Деталі об'єкта нерухомості</h1>

    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div v-if="property.images?.length" class="card">
                <Galleria :value="property.images" :responsiveOptions="galleriaResponsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
                    <template #item="slotProps">
                        <Image
                            :src="slotProps.item"
                            :alt="slotProps.item.title"
                            preview
                            style="margin: 0 auto;
                            max-height: 400px"
                        />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item" :alt="slotProps.item.title" width="100" style="height: 65px; padding: 0 5px"/>
                    </template>
                </Galleria>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Назва</div>
                <div>{{ property.title }}</div>

                <div class="font-semibold text-xl">Тип нерухомості</div>
                <div>{{ property.category?.name }}</div>

                <div class="font-semibold text-xl">Мета використання</div>
                <div>{{ property.subcategory?.name }}</div>

                <div v-if="property.subcategory && property.subcategory.code === 'SALE'" class="font-semibold text-xl">Ціна USD</div>
                <div v-if="property.subcategory && property.subcategory.code === 'SALE'">{{ property.priceUSD }} $</div>

                <div v-if="property.subcategory && property.subcategory.code !== 'SALE'" class="font-semibold text-xl">Вартість оренди</div>
                <div v-if="property.subcategory && property.subcategory.code !== 'SALE'">{{ property.priceUSD }} $</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Розташування</div>
                <div class="font-semibold text-sm">Область</div>
                <div>{{ property.address.region?.name }}</div>

                <div class="font-semibold text-sm">Місто</div>
                <div>{{ property.address.city.name }}</div>

                <div class="font-semibold text-sm">Вулиця</div>
                <div>{{ property.address.street }}</div>

                <GoogleMapAddApartment
                    style="width: 100%; height: 500px"
                    :area="property.address.area"
                    :center="property.address.markerPosition"
                    :disabled="true"
                />
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Площа(м²)</div>
                <div class="font-semibold text-sm">Загальна площа</div>
                <div>{{ property.apartmentArea.totalArea }} м²</div>

                <div class="font-semibold text-sm">Жила площа квартири</div>
                <div>{{ property.apartmentArea.livingArea }} м²</div>

                <div class="font-semibold text-sm">Площа кухні</div>
                <div>{{ property.apartmentArea.kitchenArea }} м²</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Тип опалення</div>
                <div>{{ property.heatingType?.name }}</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Комунальні послуги</div>
                <div>
                    <ul>
                        <li v-for="utility in property.utilities" :key="utility.code">{{ utility.name }}</li>
                    </ul>
                </div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Меблі</div>
                <div>{{ property.furniture?.name }}</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Паркування</div>
                <div>{{ property.parking?.name }}</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Контакти</div>
                <div>{{ property.owner?.username }}</div>
                <div v-if="property.owner?.message" class="mt-2">{{ property.owner?.message }}</div>
            </div>
        </div>
    </Fluid>

    <Fluid class="flex flex-col mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Додадковий опис об'єкта</div>
            <div>{{ property.description }}</div>
        </div>
    </Fluid>

    <Fluid class="flex mt-8">
        <div class="field max-w-60">
            <Button label="Назад" icon="pi pi-arrow-left" @click="goBack" />
        </div>
    </Fluid>

    <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import GoogleMapAddApartment from '@/components/googleMap/AddApartment.vue';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const propertyId = route.params.id;
const property = ref({
    title: '',
    priceUSD: null,
    category: null,
    subcategory: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    address: {
        region: null,
        city: '',
        street: '',
        markerPosition: null
    },
    heatingType: null,
    utilities: [],
    furniture: null,
    parking: null,
    description: ''
});

onMounted(async () => {
    await loadPropertyData(propertyId);
});

const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

const loadPropertyData = async (id) => {
    try {
        const propertyRef = doc(db, 'properties', id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            property.value = propertyDoc.data();
        } else {
            console.error('Об\'єкт не знайдений!');
        }
    } catch (error) {
        console.error('Ошибка при загрузке объекта:', error);
    }
};

const goBack = () => {
    router.go(-1); // Переход на предыдущую страницу
};
</script>

<style scoped>
img {
    max-width: 100%;
    margin: 0 auto;
}
.location-picker {
    width: 100%;
}
</style>
