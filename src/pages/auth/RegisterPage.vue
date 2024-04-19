<script setup>
  import {ref} from 'vue'
  import {isValidEmail} from "src/js/emailUtil";
  import {useRoute, useRouter} from "vue-router";
  import {useMutation} from "@vue/apollo-composable";
  import {REGISTER, LOGIN} from "src/js/login";
  import { useQuasar } from 'quasar'

  let $route = useRoute();
  let $router = useRouter();

  const email = ref($route.query.e)
  const username = ref("")
  const password = ref("")
  const passwordCopy = ref("")

  const isPwd = ref(true)

  const {mutate: register} = useMutation(REGISTER);
  const {mutate: login} = useMutation(LOGIN);

  const $q = useQuasar()

  async function onSubmit() {
    try {
      const input = {
        username: username.value,
        email: email.value,
        password: password.value
      }

      const {data: registerData} = await register(input)

      const {data: loginData} = await login(input)

      console.log(loginData)
      $q.sessionStorage.set("jwt-token", loginData["login"]["token"])

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
    <h1>Register</h1>
    <h3>Create a new account in less than 30 seconds! </h3>
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
