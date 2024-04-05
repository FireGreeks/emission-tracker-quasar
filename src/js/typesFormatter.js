//usePlatform.js
import { ref } from 'vue';

export function deserializeTravelMethod(f) {
  return (f.charAt(0) + f.slice(1).toLowerCase()).replace("_", " ")
}
