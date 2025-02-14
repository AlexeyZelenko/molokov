<template>
    <div style="height:600px; width:100%">
        {{coordinates}}
        <l-map
            ref="map"
            v-model:zoom="zoom"
            :center="[49.4444, 32.0598]"
            :use-global-leaflet="false"
        >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>

            <l-marker v-if="coordinates" :lat-lng="coordinates" draggable> </l-marker>
        </l-map>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
    props: {
        property: Object
    },

    components: {
        LMap,
        LTileLayer,
        LMarker
    },
    data() {
        return {
            zoom: 12,
        };
    },
    computed: {
        coordinates() {
            return this.property?.address.markerPosition || [49.4444, 32.0598];
        }
    }
};
</script>

<style>

</style>

<!--https://github.com/vue-leaflet/vue-leaflet-->
