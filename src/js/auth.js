import {provideApolloClient, useMutation, useQuery} from "@vue/apollo-composable";
import {gql} from "@apollo/client/core";
import {SessionStorage} from "quasar";
import Router from '../router';
import {notifyError, safeUseQuery} from "src/js/GQL";
import apollo from "boot/apollo";
import {loadingNotification} from "src/js/notificationUtil";

export const LOGIN = gql(`
  mutation login ($email: String, $password: String) {
    login(
      credentialsInputDto : {
        email:$email, password:$password
       }
    )
  }
`)

export const REGISTER = gql(`
  mutation register ($username: String, $email: String, $password: String) {
    register(
      userDto : {
        email:$email, username: $username, password:$password
       })
    {
      username
    }
  }
`)

export const {mutate: registerMutate} = useMutation(REGISTER)
export const {mutate: loginMutate} = useMutation(LOGIN)

export async function register(email, username, password, onRegister, onError) {

  const loading = loadingNotification("Please wait...")
  try {
    const input = {
      username: username,
      email: email,
      password: password
    }

    const {data} = await registerMutate(input)
    onRegister(data)

  } catch (error) {
    notifyError(error.message)
    onError(error)
  } finally {
    loading()
  }
}

export async function login(email, password, onLogin, onError) {
  const loading = loadingNotification("Please wait...")
  try {
    const input = {
      email: email,
      password: password
    }

    const {data} = await loginMutate(input)
    onLogin(data)

  } catch (error) {
    notifyError(error.message)
    onError(error)
  } finally {
    loading()
  }
}

export async function storeLoginData(data) {
  SessionStorage.set("jwt-token", data["login"]["token"])
  const router = Router();
  router.push("/app").then(r => router.go(0))
}

export function logout() {
  SessionStorage.remove("jwt-token")
  const router = Router()
  router.replace("/").then(r => router.go(0))
}

export function checkEmailPasswordError(error, emailError, passwordError) {
  if (error.message.includes("email"))
    emailError.value = true

  if (error.message.includes("password"))
    passwordError.value = true

  setTimeout(() => {
    emailError.value = false
    passwordError.value = false
  }, 5000)
}
