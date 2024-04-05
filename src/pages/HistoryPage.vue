<script setup>
  import {useQuery} from "@vue/apollo-composable";
  import {gql} from "@apollo/client/core";
  import {ref, onMounted, reactive} from 'vue'
  import {date, useQuasar} from "quasar";
  import {deserializeTravelMethod} from "src/js/typesFormatter";

  const $q = useQuasar()

  const { result, loading, error, refetch } = useQuery(gql(`
    query getHistory ($page: Int!, $count: Int!, $descending: Boolean!) {
      travelHistory(page: $page, count: $count, descending: $descending) {
        id
        date
        start { coordinates, label }
        end { coordinates, label }
        distance
        emission
        stops {
          previousPoint { label }
          point { label }
          travelMethod
          distance
          emission
        }
      },
      overallStats {
        totalTravels
      }
    }
  `), {
    page: 0,
    count: 3,
    descending: false
  })


  const columns = [
    {
      name: 'expand', label: "", field: 'expand',
    },
    {
      name: 'date',
      required: true,
      label: 'Date & Time',
      align: 'left',
      field: row => row["date"],
      format: (d) => date.formatDate(
        date.extractDate(d, "YYYY-MM-DD"),
        $q.platform.is.mobile ? "DD/MM/YY" : "Do MMMM YYYY"),
      sortable: true
    },
    {
      name: 'start', label: "From", field: 'start',
      format: (m) => m["label"]
    },
    {
      name: 'destination', label: "To", field: 'end',
      format: (m) => m["label"]
    },
    {
      name: 'distance', label: 'Distance (km)', field: 'distance',
      format: (d) => d.toFixed(2) + "km"
    },
    {
      name: 'emission', label: 'CO2 Emission (kg)', field: 'emission',
      format: (e) => e.toFixed(2) + "kg"
    },
  ]

  const tableRef = ref()
  const rows = ref([])
  const filter = ref('')
  const pagination = ref({
    page: 1,
    rowsPerPage: 3,
    rowsNumber: 10,
    descending: true,
    sortBy: "date"
  })


  function onRequest (props) {
    const {page, rowsPerPage, descending} = props.pagination

    refetch({
      page: page,
      count: rowsPerPage,
      descending: descending
    }).then(data => {
      rows.value = data.data["travelHistory"];

      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.descending = descending
      pagination.value.rowsNumber = data.data["overallStats"]["totalTravels"]
    });

  }

  const carouselPages = reactive({})
  function toggleRowExpand(props)
  {
    props.expand = !props.expand;
    carouselPages[props.rowIndex * props.pageIndex] = "0";
  }
  function getTravelMethodIcon(travelMethod) {
    switch(travelMethod) {
      case 'AIRPLANE': return 'flight_takeoff';
      case 'BICYCLE': return  'pedal_bike';
      case 'BUS': return 'airport_shuttle';
      case 'TRAIN': case 'SUBWAY': return 'train';
      default: return 'transportation';

    }
  }

  onMounted(() => {
    // get initial data from server (1st page)
    onRequest({pagination :{page: 1, rowsPerPage:3, descending:true}})
  })
</script>

<template>
  <q-page class="q-pa-md">
    <div class ="page-container">
      <h2 class="text-center">Travel History</h2>
      <h5 class="subtitle text-center">All previous travels</h5>

      <br/>
      <p>On this page, you have access to all previously submitted travels along with their
        relevant information. Whether you're looking to review past trips, analyze travel patterns,
        or assess the environmental impact of your journeys, this comprehensive archive provides
        you with the data you need.
      </p>

      <p><b>Tips</b>: You can sort ascending or descending by date.</p>

      <q-btn
        @click="onRequest({pagination: {page: 1, rowsPerPage:pagination.rowsPerPage}})"
        class="bg-primary q-mt-sm q-mb-sm"
      >
        Refresh data
      </q-btn>

      <q-table
        flat bordered
        ref="tableRef"
        title="Last Travels"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading.value"
        :filter="filter"
        binary-state-sort
        @request="onRequest"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :key="`m_${props.row.index}`"
            @click="toggleRowExpand(props)"
          >
            <q-td auto-width>
              <q-btn
                dense round flat
                :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"/>
            </q-td>
            <q-td
              v-for="col in props.cols.slice(1, props.cols.length)"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr :props="props" v-show="props.expand">
            <q-td colspan="100%">
              <q-carousel
                v-model="carouselPages[props.rowIndex * props.pageIndex]"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                animated
                control-color="black"
                arrows
                padding
                height="70px"
                class="no-wrap rounded-borders"
              >
                <q-carousel-slide
                  v-for="(stop, index) in props.row.stops"
                  :key="index"
                  :name = "index.toString()"
                  class="row no-wrap items-center justify-between"
                >
                  <div class="row inline q-ml-sm items-center">
                    {{stop["previousPoint"]["label"]}}
                    <q-icon :name="getTravelMethodIcon(stop['travelMethod'])" class="q-ma-md"/>
                    {{stop["point"]["label"]}}
                  </div>
                  <div class="column no-wrap q-pa-sm" style="width:200px">
                    <div>Distance:
                      <span class="data">{{stop["distance"].toFixed(2)}} km</span></div>
                    <div>Emission:
                      <span class="data">{{stop["emission"].toFixed(2)}} kg</span></div>
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

  .data {
    font-family: "Anton", sans-serif;
    padding-left: 1rem;
  }
</style>
