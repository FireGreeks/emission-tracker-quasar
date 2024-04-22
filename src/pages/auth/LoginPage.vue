<script setup>

  import {ref} from 'vue'
  import {isValidEmail} from "src/js/regexUtil";
  import {checkEmailPasswordError, login, register, storeLoginData} from "src/js/auth";

  const email = ref("")
  const password = ref("")
  const isPwd = ref(true)

  const emailError = ref(false)
  const passwordError = ref(false)


</script>

<template>
    <div>
      <h1 class="title-simple">Welcome Back!</h1>
      <h3 class="subtitle-simple">Log into you Emission Tracker account to continue:) </h3>
    </div>

    <q-form
      @submit="login(email, password, storeLoginData, (e) => checkEmailPasswordError(e, emailError, passwordError))"
      class="q-gutter-md q-mt-lg"
    >
      <q-input
        filled
        v-model="email"
        lazy-rules
        label="E-mail"
        :error="emailError"
        :rules="[
          val => val && val.length > 0 || 'Please type in something',
          val => isValidEmail(val) || 'Please type in a valid e-mail address'
        ]"
      />
      <q-input
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Password"
        v-model="password"
        :error="passwordError"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Please type your password']"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-btn label="Sign-In" type="submit" color="primary" class="submit"/>
      <q-btn
        flat class="text-primary float-right p-pa-none q-mb-lg"
        label="Don't have an account? Create one!"
        :to="'/auth/register' + (email ? '?e='+email : '')"/>
    </q-form>


</template>

<style scoped>


</style>
