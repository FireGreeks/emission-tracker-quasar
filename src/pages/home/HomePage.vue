<script setup>
  import {ref} from "vue";
  import {gql} from "@apollo/client/core";
  import {useQuery} from "@vue/apollo-composable";
  import {useRouter} from "vue-router";

  const isAuthenticated = ref(false)
  const router = useRouter()

  const PROFILE = gql(`
    query profile {
      profile {
        name
      }
    }
  `)

  const {onResult, result, loading, error} = useQuery(PROFILE, {}, {errorPolicy: "none"})

  onResult((result) => {
    if (!result.loading && !result.error) {
      isAuthenticated.value = true;
    }
  })

</script>

<template>
  <q-page class="q-pa-sm">
    <div class ="page-container">
      <h1 class="text-center">Emission Tracker</h1>

      <br/>

      <div class="flex flex-center">
        <q-btn
          v-if="isAuthenticated"
          :label="'To Your App' + (loading || error ? '' : ' -- ' + result['profile']['name'])"
          size="xl"
          color="primary"
          push
          to="/app"
        >
        </q-btn>
      </div>

      <br/>
      <p>
        Welcome to <b>Emission Tracker</b>! This app is designed to monitor your transportation
        emissions and provide valuable insights into your environmental impact. By tracking
        various modes of transportation, from daily commutes to long-distance travel,
        Emission Tracker helps you understand the carbon footprint associated with your journeys.
      </p>

      <div class="highlight-box" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '85%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">Stats</h5>
          <p>Find every statistic relevant to your recorded travel emissions: <b>carbon footprint</b>, <b>environmental impact</b> and <b>emissions</b></p>
        </div>
        <img src="~assets/stats.png" alt="New travel" style="width:100%"/>
      </div>
      <br/>
      <div class="highlight-box" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '85%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">New Travel</h5>
          <p>Create a new travel by simply providing details regarding the <b>travel method</b> and the <b>distance traveled</b></p>
        </div>
        <img src="~assets/new-travel.png" alt="New travel" style="width:100%"/>
      </div>
      <br/>
      <div class="highlight-box" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '85%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">History</h5>
          <p>Access all previously submitted travels along with their relevant information.</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
