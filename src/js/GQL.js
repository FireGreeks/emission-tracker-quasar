import {useQuery} from "@vue/apollo-composable";
import Router, {ignoreAuthPathNames} from "../router";
import {Notify} from "quasar";


export function safeUseQuery(gql, variables, onError) {

  const data = useQuery(gql, variables, {errorPolicy: "none"})
  data.onError((error) => {
    if (onError) onError()
    const router = Router()
    if (!ignoreAuthPathNames.includes(router.currentRoute.value.name))
      router.push("/auth").then(r => notifyError(error.message))
  })
  return data;
}

export function safeRefetch(refetch, variables) {
  return new Promise((resolve) => {
    refetch(variables).then((result) => {
      const router = Router()
      if (result.error && !ignoreAuthPathNames.includes(router.currentRoute.value.name))
        router.push("/auth").then(r => notifyError(result.error.message))
      resolve(result)
    })
  })
}


export function notifyError(message) {
  let notificationMessage;
  if (message === "Failed to fetch")
    notificationMessage = "Couldn't connect to server... Please check your connection"
  else
    notificationMessage = message.slice(message.indexOf(":") + 2)

  if (notificationMessage === "Bad credentials")
    notificationMessage += ". The email and/or the password are incorrect."

  Notify.create({
    message: notificationMessage,
    color: "red"
  })

  return notificationMessage;
}
