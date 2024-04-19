const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/app/IndexPage.vue') },
      { path: 'new', component: () => import('pages/app/NewTravel.vue') },
      { path: 'profile', component: ()=> import('pages/app/ProfilePage.vue') },
      { path: 'history', component: () => import('pages/app/HistoryPage.vue') },
      { path: 'stats', component: () => import('pages/app/StatsPage.vue') },
      { path: 'help', component: () => import('pages/app/HelpPage.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/app/ErrorNotFound.vue')
  }
]

export default routes
