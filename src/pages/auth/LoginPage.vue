<script setup>

  import {ref} from 'vue'
  import {isValidEmail} from "src/js/emailUtil";
  import {useRoute, useRouter} from "vue-router";
  import {useMutation} from "@vue/apollo-composable";
  import {LOGIN} from "src/js/login";
  import {useQuasar} from "quasar";

  let $router = useRouter()
  let $route = useRoute()

  const email = ref($route.query.e)
  const password = ref("")
  const isPwd = ref(true)

  const {mutate: login} = useMutation(LOGIN)

  let $q = useQuasar()

  async function onSubmit() {
    try {
      const input = {
        email: email.value,
        password: password.value
      }

      const {data} = await login(input)

      $q.sessionStorage.set("jwt-token", data["login"]["token"])

      await $router.push({path: "/"})

    } catch (error) {
      $q.notify({
        message: error.toString(),
        color: "red"
      })
    }
  }


</script>

<template>
    <div>
      <h1>Welcome Back!</h1>
      <h3>Log into you Emission Tracker account to continue:) </h3>
    </div>

  <q-form
    @submit="onSubmit"
    class="q-gutter-md q-mt-lg"
  >
    <q-input
      filled
      v-model="email"
      lazy-rules
      label="E-mail"
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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  h1 {
    font-family: "Roboto", sans-serif;
    height: 60px;
    font-size: 40px;
    margin-bottom: 0;
    padding: 0;
  }

  h3 {
    font-size: 15px;
    color: gray;
    display: inline;
    font-family: "Roboto", sans-serif;
  }

  .submit {
    font-family: "Roboto", sans-serif;
    width: 97%;
  }

</style>
