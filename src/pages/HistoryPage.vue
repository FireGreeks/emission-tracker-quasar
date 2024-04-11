<script setup>
  import {useQuery} from "@vue/apollo-composable";
  import {gql} from "@apollo/client/core";
  import {ref, onMounted, reactive} from 'vue'
  import {date, useQuasar} from "quasar";
  import {deserializeTravelMethod} from "src/js/typesFormatter";
  import TravelDetails from "components/TravelDetails.vue";

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

          <q-tr :props="props" v-show="props.expand" v-if="!$q.platform.is.mobile">
            <q-td colspan="100%">
              <TravelDetails :stops="props.row.stops" :vertical-layout="false" height="70px"/>
            </q-td>
          </q-tr>

          <q-dialog v-model="props.expand" v-if="$q.platform.is.mobile">
            <q-card>
              <q-card-section class="q-pa-none text-right ab">
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-card-section class="q-pa-none">
                <TravelDetails :stops="props.row.stops" :vertical-layout="true" height="170px"/>
              </q-card-section>
            </q-card>

          </q-dialog>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<style scoped>

</style>
