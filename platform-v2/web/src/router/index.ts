import { createRouter, createWebHistory } from 'vue-router'
import PilotOverview from '../views/PilotOverview.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/pilot' },
    { path: '/pilot', component: PilotOverview }
  ]
})
