<template>
  <q-page class="q-pa-sm">
    <div class ="page-container">
      <h1 class="text-center">Emission Tracker</h1>

      <br/>
      <p>
        Welcome to <b>Emission Tracker</b>! This app is designed to monitor your transportation
        emissions and provide valuable insights into your environmental impact. By tracking
        various modes of transportation, from daily commutes to long-distance travel,
        Emission Tracker helps you understand the carbon footprint associated with your journeys.
      </p>

      <div class="highlight-box row" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '75%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">New Travel</h5>
          <p>Create a new travel by simply providing details regarding the <b>travel method</b> and the <b>distance traveled</b></p>
          <q-btn push color="primary" label="Register New Travel" to="/new"/>
        </div>
        <q-img v-if="!$q.platform.is.mobile" class="col" src="~assets/transportation.svg"></q-img>
      </div>
      <br/>
      <div class="highlight-box row" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '75%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">Stats</h5>
          <p>Find every statistic relevant to your recorded travel emissions: <b>carbon footprint</b>, <b>environmental impact</b> and <b>emissions</b></p>
          <q-btn push color="primary" label="See Statistics" to="/stats"/>
        </div>
        <q-img v-if="!$q.platform.is.mobile" class="col" src="~assets/stats.svg"></q-img>
      </div>
      <br/>
      <div class="highlight-box row" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '75%')">
        <div class="col" style="flex-basis: 50%">
          <h5 class="small-title">History</h5>
          <p>Access all previously submitted travels along with their relevant information.</p>
          <q-btn push color="primary" label="See Travel History" to="/history"/>
        </div>
        <q-img v-if="!$q.platform.is.mobile" class="col" src="~assets/history.svg"></q-img>
      </div>
    </div>
  </q-page>
</template>

<script setup>

</script>
