<script setup>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {gql} from "@apollo/client/core";
import {notifyError, safeUseQuery} from "src/js/GQL";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {ref} from 'vue'
import {isValidEmail} from "src/js/regexUtil";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {loadingNotification} from "src/js/notificationUtil";



const PROFILE = gql(`
  query profile {
    profile {
      name
      email
    }
  }
`)

const UPDATE_PROFILE = gql(`
  mutation updateProfile ($username: String, $email: String) {
    updateProfile(
      userDto : {
        username: $username,
        email: $email
      }
    )
    {
      name
      email
    }
  }
`)

const {data, onResult, loading, error} = safeUseQuery(PROFILE)
const {mutate: updateProfileMutate} = useMutation(UPDATE_PROFILE)

onResult((result) => {
  if (result.loading) return;
  username.value = result.data["profile"]["name"]
  email.value = result.data["profile"]["email"]
})

const $q = useQuasar()

const profileImage = ref()
const username = ref("")
const email = ref("")

async function submitProfileUpdate() {
  const loading = loadingNotification("Please wait")
  try {
    const input = {
      username: username.value,
      email: email.value,
    }

    const {data} = await updateProfileMutate(input)

    $q.notify({
      message: "User profile information has been updated (Reload the page to see the changes)",
      color: "green"
    })

  } catch (error){
    notifyError(error.message)
  } finally {
    loading()
  }
}

</script>

<template>
  <q-page class="q-pa-md">
    <div class ="page-container">
      <h2 class="text-center">Profile Page</h2>
      <h5 class="subtitle text-center">Settings and information</h5>

      <q-form @submit="submitProfileUpdate">
        <div class="row justify-start q-mt-lg">
          <div>

            <q-avatar size="150px">
              <img ref="profileImage"
                   src="~assets/default-profile.jpg"
                   alt="profile picture">
            </q-avatar>

          </div>
          <div class="col q-ml-md">
            <q-input
              filled
              label="Name / Username"
              v-model="username"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Please type your name/username']"
            />
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

          </div>
        </div>
        <q-btn label="Save" type="submit" color="primary" class="float-right"/>
      </q-form>

    </div>
  </q-page>
</template>
