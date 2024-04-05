<script setup>
  import mapboxgl from "mapbox-gl";
  import {onMounted, onUnmounted, ref, watch} from "vue";

  mapboxgl.accessToken = "pk.eyJ1IjoiZmlyZWdyZWVrcyIsImEiOiJjam9rbHZ6cXIwMHhyM2tvMmJ5dDBuZjh2In0.rnsYShGrQvcgyEi_FbTjtg"

  const props = defineProps({
    points: Array,
    methods: Array
  })

  watch(() => props.points, updatePoints)

  const mapContainer = ref(null);
  const mainMap = ref();

  const colorPalette = [
    '#fd5a5a',
    '#417cfc',
    '#9cfa44',
    '#faf05e',
    '#d22efc',
    '#53f5ee',
    '#fc6c12',
    '#f312e7',
  ]

  onMounted(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.value,
      style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
      center: [0, 40],
      zoom: 1,
    });

    map.on('load', () => {
      mainMap.value.addSource('trace', { type: 'geojson', data: createGeometryData() })
      mainMap.value.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'trace',
        'layout': { 'line-cap': 'round' },
        'paint': {
          'line-width': 4,
          'line-color': ['get', 'color']
        }
      });
      updatePoints()
    });
    mainMap.value = map;
  })

  onUnmounted(() => {
    mainMap.value.remove();
    mainMap.value = null;
  })


  function updatePoints() {
    if (!props.points.every(p => p.length !== 0))
      return;

    mainMap.value.getSource('trace').setData(createGeometryData());

    if (props.points.length === 1)
      mainMap.value.flyTo({center: props.points[0], zoom: 9})

    else if (props.points.length !== 0) {
      let bounds = props.points.reduce(function (bounds, coordinates) {
        return bounds.extend(coordinates);
      }, new mapboxgl.LngLatBounds(props.points[0], props.points[0]));

      mainMap.value.fitBounds(bounds, {
        padding: 40
      });
    }
  }

  const currentColors = ref({})
  function createGeometryData() {
    let features = []

    for (let i = 0; i < props.points.length - 1; i++) {
      const method = props.methods[i];
      if (!currentColors.value.hasOwnProperty(method))
        currentColors.value[method] = colorPalette[Object.keys(currentColors.value).length]

      features.push({
        'type': 'Feature',
        'properties': {
          'color': currentColors.value[method]
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            props.points[i],
            props.points[i + 1]
          ]
        }
      })
    }

    return {
      'type': 'FeatureCollection',
      'features': features
    };
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  }

</script>

<template>
  <div class="column">
    <div ref="mapContainer" class="map-container"></div>
    <div class="methods-container row">
      <div v-for="methodProperty in props.methods.filter(distinct)" :key="methodProperty" class="q-mr-md">
        <div class="color-box col" :style="'background-color: ' + currentColors[methodProperty]"/>
        {{methodProperty === null ? ":None" : ":" + methodProperty}}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .map-container {
    flex: 1;
  }

  .methods-container {
    padding-top: .5rem;
  }

  .color-box {
    height: 20px;
    width:20px;
    float:left;
    background-color: white;
    flex-grow: 1;
    margin-right:5px;
  }

</style>
