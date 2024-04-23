
<script setup>
  import {ref} from 'vue'
  import {date, useQuasar} from "quasar";
  import {useMutation, useQuery} from '@vue/apollo-composable'
  import { gql } from '@apollo/client/core'
  import MainMap from "components/MainMap.vue";
  import AddressInput from 'components/AdressBar.vue'
  import draggable from "vuedraggable";
  import {loadingNotification} from "src/js/notificationUtil";
  import {deserializeTravelMethod} from "src/js/typesFormatter";

  const $q = useQuasar()
  const travelMethodOptions = ref([])

  const { onResult, onError: onErrorQuery } = useQuery(gql(`
    query {
      travelMethods
    }
  `))

  onResult((result) => {
    if (result.loading) return;

    travelMethodOptions.value = result.data["travelMethods"];
  })

  const start = ref({
    label: "",
    coordinates: [],
    category: ""
  })
  const stops = ref([{
    point: {
      label: "",
      coordinates: [],
      category: ""
    },
    travelMethod: null,
  }])
  const points = ref([])
  const methods = ref([])


  const datetime = ref(date.formatDate(Date.now(), "YYYY/MM/DD"))


  const { mutate: addTravel, onError } = useMutation(gql(`
      mutation addTravel ($date: LocalDate, $start: WorldPointInput, $stops: [TravelStopInput]) {
        addTravel(
          travelDto : {
            date:$date, start: $start, stops:$stops
           })
        {
          distance,
          emission
        }
      }
    `))

  function onSubmit() {

    let newTravel = addTravel({
      date: date.formatDate(datetime.value, "YYYY-MM-DD"),
      start: start.value,
      stops: stops.value
    })

    const loading = loadingNotification("Please Wait...")

    newTravel.then((data) => {
      loading()

      const emission = Math.floor(data.data["addTravel"]["emission"] * 1000)
      $q.notify({
        message: 'Travel successfully added! You emitted ' + emission + 'g of Co2',
        color: "green"
      })

      onReset()
    })
  }

  function onReset() {
    datetime.value = date.formatDate(Date.now(), "YYYY-MM-DD")
    start.value = {
      label: "",
      coordinates: [],
      category: ""
    };

    stops.value = [{
      point: {
        label: "",
        coordinates: [],
        category: ""
      },
      travelMethod: null,
    }];
  }

  const addStop = () => {
    const previousCategory = stops.value[stops.value.length-1].point.category
    const travelMethod = getTravelMethodByCategory(previousCategory)
    stops.value.push({
      point: {
        label: "",
        coordinates: [],
        category: "",
      },
      travelMethod: travelMethod,
    })
  }
  const removeStop = (index) => {
    stops.value.splice(index, 1)
    updatePoints()
  }

  function onAddressSelect(suggestion, index) {
    const travelMethod = getTravelMethodByCategory(suggestion["category"])
    if (index < stops.value.length && stops.value[index].travelMethod === null)
      stops.value[index].travelMethod = travelMethod;

    updatePoints()
  }

  function getTravelMethodByCategory(category) {
    let travelMethod = null;
    switch (category) {
      case 'airport': travelMethod = 'AIRPLANE'; break;
      case 'bus station': travelMethod = 'BUS'; break;
      case 'train station': travelMethod = 'TRAIN'; break;
      case 'public transport station': travelMethod = 'SUBWAY'; break;
    }
    return travelMethod
  }

  function updatePoints() {
    if (stops.value[0].point.coordinates.length === 0) points.value = [start.value.coordinates];
    else if (start.value.coordinates.length === 0) points.value = [...stops.value.map(s => s.point.coordinates)]
    else points.value = [start.value.coordinates, ...stops.value.map(s => s.point.coordinates)]

    methods.value = stops.value.map(s => s.travelMethod)
  }


</script>

<template>
  <q-page class="q-pa-sm">
    <div class ="page-container">
      <h2 class="text-center">New Travel</h2>
      <h5 class="subtitle text-center">Add a new travel</h5>

      <br/>

      <p>To add a new travel, simply provide details regarding the <b>travel method</b> and the
        <b>distance traveled</b>. This information will enable us to accurately calculate the
        associated emissions and provide you with a comprehensive overview of your environmental impact.
      </p>

      <p>To get an overview of how we calculate the associated emissions, please visit our
      <router-link to="/help">help page</router-link>.
      </p>

      <br/>

      <div :class="$q.platform.is.mobile ? '' : 'form-container'">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md q-mb-md"
        >

          <q-input filled v-model="datetime" mask="date" label="Date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="datetime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <AddressInput v-model="start" label="From"
                        @addressSelect="(s) => onAddressSelect(s, 0)"/>
          <draggable
            tag="div"
            v-model="stops"
            item-key="id"
            handle=".handle"
            style="border-top:0.5px solid black"
          >
            <template #item="{ element, index }">
              <div class="list-group-item row" v-bind:key="element.id">
                <q-btn
                  round color="transparent" text-color="black" icon="close" flat
                  v-if="stops.length !== 0"
                  size="sm"
                  style="position: absolute; left:.4rem;"
                  @click="removeStop(index)"/>

                <q-icon name="menu" color="black" size="1.5rem" class="handle" style="align-self: center"/>

                <div style="width:75%; flex-grow:1">
                  <q-select
                    v-model="stops[index].travelMethod"
                    :options="travelMethodOptions"
                    @update:modelValue="updatePoints()"
                    label="Travel Method*"
                    lazy-rules
                    :rules="[val => val !== null || 'Please select a travel method']"
                  />
                  <AddressInput @addressSelect="(s) => onAddressSelect(s, index + 1)"
                    v-model="stops[index].point"
                    label="To"/>
                </div>

              </div>
            </template>

          </draggable>
          <q-btn icon="add" color="primary" label="Add stop" @click="addStop"/><br/>

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>

        </q-form>

        <MainMap
          class="col q-ml-md"
          style="aspect-ratio: 1.3"
          :points="points"
          :methods="methods"/>
      </div>
    </div>
  </q-page>
</template>


<style scoped>

.form-container {
  display: grid;
  grid-template-columns: 35% 65%;
}

.handle {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-right: 1rem;
}

input {
  display: inline-block;
  width: 50%;
}

.list-group-item {
  border-bottom: .5px solid black;
  padding-bottom: 1rem;
}
</style>
