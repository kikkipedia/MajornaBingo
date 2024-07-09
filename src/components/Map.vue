<template>
    <div id="map">
        <GoogleMap
        :api-key="key"
        style="width: 100%; height: 250px"
        :center="center"
        :zoom="15"
        :options="{ disableDefaultUI: true }"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from "vue3-google-map";
 
const key = import.meta.env.VITE_GOOGLE_API

const props = defineProps({
    coordinates: Object
})

const center = ref()

onMounted(() => {
    if(props.coordinates){
        const lat = props.coordinates._lat
        const lng = props.coordinates._long
        center.value = {lat: lat, lng: lng}
    }
    
    //convert coordinates to latlng
    
});



</script>
<style scoped>
#map {
    max-height: 300px
}
</style>