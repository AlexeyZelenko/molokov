<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Розташування</div>
        <div class="font-semibold text-sm">Область / Місто</div>
        <div>{{ address.region?.name }} / {{ address.city.name }}</div>

        <div class="font-semibold text-sm">Район / Вулиця</div>
        <div>{{ address?.area?.name }} / {{ address.street }}</div>

<!--        <GoogleMapAddApartment-->
<!--            style="width: 100%; height: 500px"-->
<!--            :area="address.area"-->
<!--            :center="address.markerPosition"-->
<!--            :disabled="true"-->
<!--        />-->
    </div>
</template>

<script setup>
// import GoogleMapAddApartment from '@/components/googleMap/AddApartment.vue';

defineProps({
    address: {
        type: Object,
        required: true,
        validator: (value) => {
            return value.city && value.street;
        }
    }
});
</script>
