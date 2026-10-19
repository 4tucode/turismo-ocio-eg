import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import AboutView from '../views/AboutView.vue'
import CulturaHistoriaView from '../views/CulturaHistoriaView.vue'
import GastronomiaView from '../views/GastronomiaView.vue'
import NaturalezaView from '../views/NaturalezaView.vue'
import OcioView from '../views/OcioView.vue'
import ProvinceView from '../views/ProvinceView.vue'
import AdminView from '../views/AdminView.vue'
import EventCategoryView from '../views/EventCategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' }
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/post/:slug',
      name: 'post',
      component: PostView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/cultura',
      name: 'cultura',
      component: CulturaHistoriaView
    },
    {
      path: '/cultura/:slug',
      name: 'cultura-article',
      component: PostView
    },
    {
      path: '/gastronomia',
      name: 'gastronomia',
      component: GastronomiaView
    },
    {
      path: '/gastronomia/:slug',
      name: 'gastronomia-article',
      component: PostView
    },
    {
      path: '/naturaleza',
      name: 'naturaleza',
      component: NaturalezaView
    },
    {
      path: '/naturaleza/:slug',
      name: 'naturaleza-article',
      component: PostView
    },
    {
      path: '/ocio',
      name: 'ocio',
      component: OcioView
    },
    {
      path: '/ocio/:slug',
      name: 'ocio-article',
      component: PostView
    },
    {
      path: '/provincia/:slug',
      name: 'province',
      component: ProvinceView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/eventos/:category',
      name: 'event-category',
      component: EventCategoryView
    }
  ]
})

export default router

