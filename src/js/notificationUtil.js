import {Notify} from "quasar";


export function loadingNotification(message) {
  return Notify.create({
    spinner: true,
    message: message,
    timeout: 2000
  })
}
