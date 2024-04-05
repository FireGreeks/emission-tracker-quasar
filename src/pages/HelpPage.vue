<script setup>
  import {useQuery} from "@vue/apollo-composable";
  import {gql} from "@apollo/client/core";
  import {ref} from "vue";
  import {deserializeTravelMethod} from "src/js/typesFormatter";

  const columns = [
    {
      name: 'name',
      align: 'left',
      required: true,
      label: 'Transport Method',
      field: 'name',
      format: s => deserializeTravelMethod(s)
    },
    {
      name: 'emission',
      align: 'left',
      label: 'CO2 Emission (g/passenger/km)',
      field: 'emissionPerKilometer',
      format: s => Math.floor(s * 1000) + " g"
    },
  ]

  const rows = ref([])

  const { onResult } = useQuery(gql(`
    query {
      travelMethodInfo {
        name
        emissionPerKilometer
      }
    }
  `))

  onResult((result) => {
    if (result.loading) return;

    rows.value = result.data["travelMethodInfo"];
  })
</script>

<template>
  <q-page class="q-pa-md">
    <div class ="page-container">
      <h2 class="text-center">Information & Help</h2>
      <h5 class="subtitle text-center">All you need to know</h5>

      <br/>
      <p>To calculate the emissions associated with a travel, we multiply the distance travelled
      by the average emission/passenger/km of used transportation method. Our data is retrieved from
        <a href="https://ourworldindata.org/travel-carbon-footprint" target="_blank">
          ourworldindata.org
          <q-icon name="open_in_new"></q-icon>
        </a>.
      </p>

      <p>Here is a table summarizing the emission values we use:</p>

      <q-table
        title="Emission of different transportation methods"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[10]"
      >

      </q-table>
    </div>
  </q-page>
</template>

<style scoped>

</style>
