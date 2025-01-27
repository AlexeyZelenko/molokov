<template>
    <h1 class="font-semibold text-xl mb-2">{{ property.title }} {{ property.idProperty }}</h1>

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
                <div class="font-semibold text-xl">Розташування</div>
                <div class="font-semibold text-sm">Область / Місто</div>
                <div>{{ property.address.region?.name }} / {{ property.address.city.name }}</div>

                <div class="font-semibold text-sm">Район / Вулиця</div>
                <div>{{ property.address?.area?.name }} / {{ property.address.street }}</div>

                <GoogleMapAddApartment
                    style="width: 100%; height: 500px"
                    :area="property.address.area"
                    :center="property.address.markerPosition"
                    :disabled="true"
                />
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Стан нерухомості</div>
                <div>{{ property.condition?.name }}</div>

                <div class="font-semibold text-xl">Тип будівлі</div>
                <div>{{ property.buildingType?.name }}</div>

                <div class="font-semibold text-xl">Клас об'єкта</div>
                <div>{{ property.objectClass?.name }}</div>

                <div class="font-semibold text-xl">Ремонт</div>
                <div>{{ property.reconditioning?.name }}</div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">
                    {{ property.category?.name }} / {{ property.subcategory?.name }}
                </div>

                <div v-if="property.subcategory && property.subcategory.code === 'sell'">{{ property.priceUSD }} $</div>

                <div v-if="property.subcategory && property.subcategory.code !== 'sell'">{{ property.priceUSD }} грн</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Площа(м²)</div>
                <div class="font-semibold text-sm">Загальна площа</div>
                <div>{{ property.apartmentArea.totalArea }} м²</div>

                <div class="font-semibold text-sm">Жила площа квартири</div>
                <div>{{ property.apartmentArea.livingArea }} м² / {{property.planning?.name}}</div>

                <div class="font-semibold text-sm">Площа кухні</div>
                <div>{{ property.apartmentArea.kitchenArea }} м²</div>

                <div class="font-semibold text-sm">Санвузел - {{ property.bathroom?.name }}</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Тип опалення</div>
                <div>{{ property.heatingType?.name }}</div>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Комунікації</div>
                <div>{{ property.communications }}</div>

                <div class="font-semibold text-xl">Інфраструктура</div>
                <div>{{ property.infrastructure }}</div>

                <div class="font-semibold text-xl">Ландшафт</div>
                <div>{{ property.landscape }}</div>

                <div class="font-semibold text-xl">Проживання тварин</div>
                <div>{{ property.animal ? 'Так' : 'Ні' }}</div>
            </div>

            <div v-if="property?.facilityReadiness" class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Готовність об'єкта</div>
                <div>{{ formatFirebaseTimestamp(property?.facilityReadiness) }}</div>
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
        </div>
    </Fluid>

    <Fluid class="flex flex-col mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Додадковий опис об'єкта</div>
            <div v-text="property.description"></div>
        </div>
    </Fluid>

    <Fluid class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <!-- Блок "контакти ріелтора" -->
        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
            <div class="card flex flex-col gap-2">
                <div class="font-semibold text-xl">Контакти ріелтора</div>
                <div>{{ property.creator?.username }}</div>
                <div v-for="phone in property.creator?.phone">Телефон: {{ phone }}</div>
                <div v-if="property.creator?.message">
                    {{ property.creator?.message }}
                </div>
            </div>
        </div>
        <!-- Блок "Інформація про власника" -->
        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
            <div class="card flex flex-col gap-2">
                <div class="font-semibold text-xl">Контакти власника / посередника</div>
                <div>{{ property.owner?.username }} - {{ property.typeOwner?.name }}</div>
                <div>Телефон: {{ property.owner?.phone }}</div>
                <div v-if="property.owner?.message">
                    {{ property.owner?.message }}
                </div>
            </div>
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
import { formatFirebaseTimestamp } from '@/utils/dateUtils';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const propertyId = route.params.id;
const category = route.query.category;
const subcategory = route.query.subcategory;
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
    description: '',
    creator: {
        username: '',
        phone: '',
        message: ''
    },
});

onMounted(async () => {
    await loadPropertyData(category, subcategory, propertyId);
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

const loadPropertyData = async (category, subcategory, id) => {
    try {
        console.log('Загрузка объекта...', category, subcategory, id);
        const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
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
