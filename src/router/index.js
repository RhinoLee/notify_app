import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LineLoginReturn from '../views/LineLoginReturn.vue'
import LineNotifyReturn from '../views/LineNotifyReturn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login/line/return',
      name: 'lineLoginReturn',
      component: LineLoginReturn
    },
    {
      path: '/notify/line/return',
      name: 'lineNotifyReturn',
      component: LineNotifyReturn
    },
  ]
})

export default router
