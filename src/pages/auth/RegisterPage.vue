<script setup>

import {checkEmailPasswordError, login, register, storeLoginData} from "src/js/auth";
import {isValidEmail} from "src/js/regexUtil";
import {ref} from "vue";

const email = ref("")
const username = ref("")
const password = ref("")
const passwordCopy = ref("")
const isPwd = ref(true)

const emailError = ref(false)
const passwordError = ref(false)

function autoLogin() {
  console.log("Auto-login: ")
  login(email.value, password.value, storeLoginData, checkEmailPassword)
}

function checkEmailPassword(e) {
  return checkEmailPasswordError(e, emailError, passwordError)
}

</script>

<template>
  <div>
    <h1 class="title-simple">Register</h1>
    <h3 class="subtitle-simple">Create a new account in less than 30 seconds! </h3>
  </div>

  <q-form
    @submit="register(email, username, password, autoLogin, checkEmailPassword)"
    class="q-gutter-md q-mt-lg"
  >
    <q-input
      filled
      v-model="email"
      :error="emailError"
      lazy-rules
      label="E-mail"
      :rules="[
        val => val && val.length > 0 || 'Please type in something',
        val => isValidEmail(val) || 'Please type in a valid e-mail address'
      ]"
    />
    <q-input
      filled
      label="Name / Username"
      v-model="username"
      lazy-rules
      :rules="[val => val && val.length > 0 || 'Please type your name/username']"
    />

    <div class="flex row justify-between">
      <q-input
        filled
        :type="isPwd ? 'password' : 'text'"
        class="col q-mr-sm"
        label="Password"
        v-model="password"
        :error="passwordError"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Please type your password']"
      />
      <q-input
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Password (Again)"
        v-model="passwordCopy"
        class="col"
        lazy-rules
        :rules="
        [
          val => val && val.length > 0 || 'Please type your password',
          val => val === password || 'Please make sure passwords are equal'
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>

    <q-btn label="Register Account" type="submit" color="primary" class="submit"/>
    <q-btn
      flat class="text-primary float-right p-pa-none q-mb-lg"
      label="Already have an account? Sign-in!"
      :to="'/auth' + (email ? '?e='+email : '')"/>
  </q-form>
</template>

<style scoped>

</style>
