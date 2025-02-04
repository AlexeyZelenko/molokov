<template>
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
        <div class="font-semibold text-xl">Стан нерухомості</div>
        <div>{{ property.condition?.name }}</div>

        <div class="font-semibold text-xl">Тип будівлі</div>
        <div>{{ property.buildingType?.name }}</div>

        <div class="font-semibold text-xl">Клас об'єкта</div>
        <div>{{ property.objectClass?.name }}</div>

        <div class="font-semibold text-xl">Ремонт</div>
        <div>{{ property.reconditioning?.name }}</div>
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

        <div class="font-semibold text-xl">Проживання тварин</div>
        <div>{{ property.animal ? 'Так' : 'Ні' }}</div>
    </div>

    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Паркування</div>
        <div>{{ property.parking?.name }}</div>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
    property: Object
})

onMounted(() => {
    console.log(props.property)
})
</script>
