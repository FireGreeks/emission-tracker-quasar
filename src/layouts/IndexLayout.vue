<script setup>

import LoginRegisterButtons from "components/LoginRegisterButtons.vue";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-item-section side>
          <q-btn
            flat
            to="/#top"
            color="white"
            round
            dense
            icon="home"
            size="20px"/>
        </q-item-section>
        <q-toolbar-title v-if="!$q.platform.is.mobile">
          Emission Tracker
        </q-toolbar-title>
        <q-space></q-space>
        <q-item-section side class="text-white float-right">
          <LoginRegisterButtons/>
        </q-item-section>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-pa-lg" style="height: 550px">
      <router-view class=""/>
    </q-page-container>
  </q-layout>
</template>

<style scoped>

  .button-container {
    width: 350px;
  }

</style>
