import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import AboutView from '../views/AboutView.vue'
import CulturaHistoriaView from '../views/CulturaHistoriaView.vue'
import CulturaArticleView from '../views/CulturaArticleView.vue'
import GastronomiaView from '../views/GastronomiaView.vue'
import NaturalezaView from '../views/NaturalezaView.vue'
import OcioView from '../views/OcioView.vue'
import ProvinceView from '../views/ProvinceView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      component: CulturaArticleView
    },
    {
      path: '/gastronomia',
      name: 'gastronomia',
      component: GastronomiaView
    },
    {
      path: '/gastronomia/:slug',
      name: 'gastronomia-article',
      component: CulturaArticleView
    },
    {
      path: '/naturaleza',
      name: 'naturaleza',
      component: NaturalezaView
    },
    {
      path: '/naturaleza/:slug',
      name: 'naturaleza-article',
      component: CulturaArticleView
    },
    {
      path: '/ocio',
      name: 'ocio',
      component: OcioView
    },
    {
      path: '/ocio/:slug',
      name: 'ocio-article',
      component: CulturaArticleView
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
    }
  ]
})

export default router

