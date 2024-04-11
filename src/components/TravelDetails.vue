<script setup>
  import {ref} from "vue";

  const page = ref("0")
  const props = defineProps({
    stops: Object,
    verticalLayout: Boolean,
    height: String
  })


  function getTravelMethodIcon(travelMethod) {
    switch(travelMethod) {
      case 'AIRPLANE': return 'flight_takeoff';
      case 'BICYCLE': return  'pedal_bike';
      case 'BUS': return 'airport_shuttle';
      case 'TRAIN': case 'SUBWAY': return 'train';
      default: return 'transportation';
    }
  }


</script>

<template>
  <q-carousel
    v-model="page"
    transition-prev="scale"
    transition-next="scale"
    swipeable
    animated
    control-color="black"
    arrows
    padding
    height="auto"
    class="no-wrap rounded-borders "
  >
    <q-carousel-slide
      v-for="(stop, index) in props.stops"
      :key="index"
      :name = "index.toString()"
      :class="'no-wrap items-center justify-between ' + (verticalLayout ? '' : 'row')"
    >
      <div :class="'inline q-ml-sm items-center no-wrap ' + (verticalLayout ? 'column justify-center' : 'row')">
        <div class="text-center">{{stop["previousPoint"]["label"]}}</div>
        <q-icon :name="getTravelMethodIcon(stop['travelMethod'])" :class=" verticalLayout ? 'q-ma-xs': 'q-ma-md'"/>
        <div class="text-center">{{stop["point"]["label"]}}</div>
      </div>
      <div :class="'column no-wrap q-pa-sm ' + (verticalLayout ? 'q-mt-md':'')" style="width:200px">
        <div>Distance:
          <span class="data">{{stop["distance"].toFixed(2)}} km</span></div>
        <div>Emission:
          <span class="data">{{stop["emission"].toFixed(2)}} kg</span></div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

  .data {
    font-family: "Anton", sans-serif;
    padding-left: 1rem;
  }
</style>
