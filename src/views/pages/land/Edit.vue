<template>
    <div class="card">
        <h1 class="m-2 text-3xl">Редагувати об'єкт нерухомості</h1>
        {{ loadingProperties }}
        {{ saving }}
        <div v-if="loadingProperties" class="flex justify-content-center">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <form v-else @submit.prevent="updateProperty" class="formgrid grid">
            <div class="field col-12 md:col-6 my-2">
                <label for="title">Назва</label>
                <InputText id="title" v-model="property.title" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="price">Ціна</label>
                <InputNumber id="price" v-model="property.price" mode="currency" currency="UAH" locale="uk-UA" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="area">Площа (м²)</label>
                <InputNumber id="area" v-model="property.area" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="rooms">Кількість кімнат</label>
                <InputNumber id="rooms" v-model="property.rooms" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="floor">Поверх</label>
                <InputNumber id="floor" v-model="property.floor" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="totalFloors">Всього поверхів</label>
                <InputNumber id="totalFloors" v-model="property.totalFloors" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="district">Район</label>
                <InputText id="district" v-model="property.district" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="street">Вулиця</label>
                <InputText id="street" v-model="property.street" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="houseNumber">Номер будинку</label>
                <InputText id="houseNumber" v-model="property.houseNumber" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="constructionYear">Рік побудови</label>
                <InputNumber id="constructionYear" v-model="property.constructionYear" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="wallMaterial">Матеріал стін</label>
                <Dropdown
                    id="wallMaterial"
                    v-model="property.wallMaterial"
                    :options="wallMaterials"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть матеріал"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="heatingType">Тип опалення</label>
                <Dropdown
                    id="heatingType"
                    v-model="property.heatingType"
                    :options="heatingTypes"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть тип опалення"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="condition">Стан</label>
                <Dropdown
                    id="condition"
                    v-model="property.condition"
                    :options="conditions"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть стан"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="balconyCount">Кількість балконів</label>
                <InputNumber id="balconyCount" v-model="property.balconyCount" />
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasParking" v-model="property.hasParking" :binary="true" />
                <label for="hasParking" class="ml-2">Паркінг</label>
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasElevator" v-model="property.hasElevator" :binary="true" />
                <label for="hasElevator" class="ml-2">Ліфт</label>
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasFurniture" v-model="property.hasFurniture" :binary="true" />
                <label for="hasFurniture" class="ml-2">Меблі</label>
            </div>

            <div class="field col-12">
                <label for="description">Опис</label>
                <Textarea id="description" v-model="property.description" rows="5" required />
            </div>

            <div class="field col-12">
                <label>Поточні фотографії</label>
                <div class="grid">
                    <div v-for="(image, index) in property.images" :key="index" class="col-12 md:col-3">
                        <div class="relative">
                            <img :src="image" :alt="property.title" class="w-full" />
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-danger absolute top-0 right-0 m-2"
                                @click="removeImage(index)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="field col-12">
                <label>Додати нові фотографії</label>
                <FileUpload
                    mode="advanced"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @select="onFileSelect"
                    :auto="true"
                    chooseLabel="Обрати"
                    uploadLabel="Завантажити"
                    cancelLabel="Скасувати"
                />
            </div>

            <div class="field col-12 flex gap-2">
                <Button type="submit" label="Зберегти" icon="pi pi-check" :loading="saving" />
                <Button type="button" label="Скасувати" icon="pi pi-times" class="p-button-secondary" @click="goBack" />
            </div>
        </form>

        <Toast />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { usePropertyStore } from '@/store/propertyStore';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = usePropertyStore();
const loadingProperties = computed(() => store.loading);
const { property, loading, saving, getProperty, updateProperty, onFileSelect, removeImage } = store;

onMounted(async () => {
    console.log('route', route);
    const propertyId = route.params.id;
    if (!propertyId) {
        await router.push('/pages/products');
    } else {
        console.log('propertyId', propertyId);
        await getProperty(propertyId);
    }
});

const goBack = () => {
    router.push('/pages/products');
};
</script>

<style scoped>
.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.top-0 {
    top: 0;
}

.right-0 {
    right: 0;
}

.m-2 {
    margin: 0.5rem;
}
</style>
