import {createMemoryHistory, createRouter} from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('layouts/IndexLayout.vue'),
    children: [
      { path: '', name: "home", component: () => import('pages/home/HomePage.vue')},
      { path: 'help', name: "help", component: () => import('pages/home/HelpPage.vue') },
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: "app", component: () => import('pages/app/StatsPage.vue') },
      { path: 'new', name: "new", component: () => import('pages/app/NewTravel.vue') },
      { path: 'profile', name: "profile", component: ()=> import('pages/app/ProfilePage.vue') },
      { path: 'history',  name: "history",component: () => import('pages/app/HistoryPage.vue') },
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      { path: '', name: "login", component: () => import('pages/auth/LoginPage.vue') },
      { path: 'register', name: "register",  component: () => import('pages/auth/RegisterPage.vue') },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
