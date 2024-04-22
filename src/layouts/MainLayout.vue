

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          @click="toggleLeftDrawer"
          round
          dense
          icon="menu"
          size="20px"/>

        <q-space></q-space>
        <q-tabs inline-label shrink>
          <q-route-tab
            icon="insights"
            :label="$q.platform.is.mobile ? void 0 : 'Stats'"
            to="/app"
            exact
          />
          <q-route-tab
            icon="add"
            :label="$q.platform.is.mobile ? void 0 : 'New Travel'"
            to="/app/new"
            exact
          />
          <q-route-tab
            icon="history"
            :label="$q.platform.is.mobile ? void 0 : 'History'"
            to="/app/history"
            exact
          />
        </q-tabs>
        <q-space></q-space>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"

      :mini="leftDrawerMini"
      @mouseover="leftDrawerMini=false"
      @mouseout="leftDrawerMini=true"
      mini-to-overlay

      @toggle="leftDrawerMini=!leftDrawerMini"
    >
      <div :class="getMiniValue() ? 'headerMini':'headerNonMini'">
        <q-img
          class="absolute-top"
          :class="getMiniValue() && 'imageBackgroundMini'"
          src="~assets/tree.jpg"
          style="height: inherit; overflow: hidden; z-index: -1"/>
        <q-avatar
          class="q-ml-sm"
          :size="getMiniValue() ? '45px' : '56px'"
          :class="getMiniValue() ? 'avatarMini' : 'avatarNonMini'"
        >
          <img src="~assets/default-profile.jpg" alt="profile picture">
        </q-avatar>
        <div class="bg-transparent q-pa-md">
          <div class="text-weight-bold text-white"> {{ loading || error ? "loading..." : result["profile"]["name"] }} </div>
          <div class="text-white overflow-hidden">{{ loading || error ? "loading..." : result["profile"]["email"] }}</div>
        </div>
      </div>

      <q-list padding>
        <q-item clickable v-ripple @click="logout()" class="log-out-btn">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>

          <q-item-section>
            Log Out
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/app/profile">
          <q-item-section avatar>
            <q-icon name="manage_accounts"/>
          </q-item-section>

          <q-item-section>
            Profile
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>

          <q-item-section>
            Home
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/help">
          <q-item-section avatar>
            <q-icon name="help"/>
          </q-item-section>

          <q-item-section>
            Help
          </q-item-section>
        </q-item>
      </q-list>

      <q-list class="absolute-bottom" style="overflow:hidden">
        <q-list>
          <q-item-label header>
            Essential Links
          </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-list>

    </q-drawer>

    <q-page-container>
        <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref } from 'vue'
  import EssentialLink from 'components/EssentialLink.vue'
  import {useQuasar} from "quasar";
  import {gql} from "@apollo/client/core";
  import {useQuery} from "@vue/apollo-composable";
  import {logout} from "src/js/auth";

  defineOptions({
    name: 'MainLayout'
  })

  const linksList = [
    {
      title: 'Facebook',
      caption: 'Theodor Bischler',
      icon: 'facebook',
      link: 'https://www.facebook.com/TheodorBischler/'
    },
    {
      title: 'Instagram',
      caption: '@theodorbischler',
      icon: 'instagram',
      link: 'https://www.instagram.com/theodorbischler/'
    }
  ]

  const leftDrawerOpen = ref(!useQuasar().platform.is.mobile)
  const leftDrawerMini = ref(!useQuasar().platform.is.mobile)

  function getMiniValue() {
    if (useQuasar().platform.is.mobile && window.window < 500)
      return false;
    return leftDrawerMini.value;
  }

  function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const mainGQL = gql(`
    query mainInformation {
      profile {
        email
        name
      }
    }`)

  const {loading, result, onResult, error} = useQuery(mainGQL)

</script>

<style>
  .imageBackgroundMini {
    opacity: 0;
    transition: opacity .1s;
  }

  .avatarMini {
    margin-top: 10px;
    transition: margin-top .2s;
  }

  .avatarNonMini {
    margin-top: 25px;
    transition: margin-top .2s;
  }

  .headerNonMini {
    height: 150px;
    transition: height .2s;
  }
  .headerMini {
    height: 50px;
    transition: height .2s;
  }

  .log-out-btn:hover {
    background-color: rgba(255, 0, 0, .3);
  }
</style>
