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
            icon="home"
            :label="$q.platform.is.mobile ? void 0 : 'Home'"
            to="/"
            exact
          />
          <q-route-tab
            icon="add"
            :label="$q.platform.is.mobile ? void 0 : 'New Travel'"
            to="/new"
            exact
          />
          <q-route-tab
            icon="insights"
            :label="$q.platform.is.mobile ? void 0 : 'Stats'"
            to="/stats"
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
          <img src="https://gravatar.com/userimage/114025816/009bda9655cef881348a187f20dfbebb.jpeg?size=256">
        </q-avatar>
        <div class="bg-transparent q-pa-md">
          <div class="text-weight-bold text-white">Theodor Bischler</div>
          <div class="text-white">@theodorbischler</div>
        </div>
      </div>

      <q-list padding>
        <q-item clickable v-ripple to="/profile">
          <q-item-section avatar>
            <q-icon name="manage_accounts"/>
          </q-item-section>

          <q-item-section>
            Profile
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/history">
          <q-item-section avatar>
            <q-icon name="history"/>
          </q-item-section>

          <q-item-section>
            History
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
</style>
