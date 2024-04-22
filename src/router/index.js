import {route} from 'quasar/wrappers'
import {createMemoryHistory, createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import routes from './routes'
import {useQuery} from "@vue/apollo-composable";
import {gql} from "@apollo/client/core";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export const ignoreAuthPathNames = ['home', 'help', 'login', 'register']

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })


  router.beforeEach(async (to, from) => {

     async function isUserAuthenticated() {
       const PROFILE = gql(`
        query profile {
          profile {
            name
            email
          }
        }
      `)

       const {onResult} = useQuery(PROFILE, {}, {errorPolicy: "none"})

       return new Promise((resolve) => {
         onResult((result) => {
           if (result.loading) return;

           if (result.error) resolve(true);
           else resolve(true);
         })
       })

     }

    if (!ignoreAuthPathNames.includes(to.name) && !await isUserAuthenticated()) {
      console.log("Path: ", to.name)
      return {path: "/auth"}
    }
  })

  return router;
})
