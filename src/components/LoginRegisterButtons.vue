<script setup>
import {logout} from "src/js/auth";
import {ref} from 'vue'
import {gql} from "@apollo/client/core";
import {useQuery} from "@vue/apollo-composable";

const isAuthenticated = ref(false)

const PROFILE = gql(`
  query profile {
    profile {
      name
    }
  }
`)

const {onResult, data} = useQuery(PROFILE, {}, {errorPolicy: "none"})

onResult((result) => {
  if (!result.loading && !result.error) {
    isAuthenticated.value = true;
  }
})
</script>

<template>
  <div v-if="!isAuthenticated" class="button-container row justify-end">
    <q-btn class="auth-button" label="Login" icon="login" to="/auth"/>
    <q-btn class="auth-button q-ml-sm" label="Register" icon="person_add" to="/auth/register"/>
  </div>
  <div v-if="isAuthenticated" class="button-container row justify-end">
    <q-btn class="auth-button" label="To App" icon="open_in_browser" to="/app"/>
    <q-btn class="auth-button q-ml-sm"
           style="background-color: rgba(255, 0, 0, 0.5)"
           label="Log Out" icon="logout" @click="logout()"/>
  </div>
</template>

<style scoped>

</style>
