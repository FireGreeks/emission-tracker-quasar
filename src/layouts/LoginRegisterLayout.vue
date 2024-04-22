<script setup>
import {date} from "quasar";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-item-section side>
          <q-btn
            flat
            to="/"
            color="white"
            round
            dense
            icon="home"
            size="20px"/>
        </q-item-section>
        <q-toolbar-title >
          Emission Tracker
        </q-toolbar-title>
        <q-item-section side class="text-white q-mr-md">
          {{ date.formatDate(Date.now(), "DD MMMM YYYY") }}
        </q-item-section>
      </q-toolbar>
    </q-header>

    <div class="mainWindow page-container" :class="{
      'absolute-center': !$q.platform.is.mobile,
      'mobile': $q.platform.is.mobile
    }">
      <q-tabs
        dense
        class="bg-grey-2 text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="justify">
        <q-route-tab
          label="Login"
          to="/auth/"
          exact
        />
        <q-route-tab
          label="Register"
          to="/auth/register"
          exact
        />
      </q-tabs>
      <q-page-container class="q-pa-md" style="padding-top: 20px; height: 550px">
        <router-view class=""/>
      </q-page-container>
    </div>

  </q-layout>
</template>

<style scoped>
  .mainWindow {
    background-color: #fdfff8;
    min-width: 200px;
    max-width: 500px;
    width: 100%;
  }

  .header {
    font-family: "Roboto", sans-serif;
  }

  .mobile {
    margin-top: 50px;
  }
</style>
