<template>
  <div class="home">
    <div class="home-content" :style="{ '--bg-image': `url(${imagenFondoImage})` }">
      <!-- Banner Publicitario Superior -->
      <!-- <div class="top-ad-banner" v-if="blogStore.banners.length > 0">
        <AdBanner :banner="blogStore.banners[0]" />
      </div> -->

      <!-- Banner Full Width -->
      <!-- <div class="full-width-banner" v-if="blogStore.banners.length > 0">
        <AdBanner :banner="blogStore.banners[0]" />
      </div> -->

      <!-- Portada Full Width Horizontal -->
      <HeroSlider :slides="portadaSlides" />

    <!-- Índice de secciones -->
    <section
      class="section-anchor mx-auto max-w-page px-(--gutter) py-16"
      id="categorias"
      data-section="categorias"
    >
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'categorias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🚀 Volver arriba
      </button>
      <SectionsIndex :articles="firestoreArticles" />
    </section>

    <!-- Agenda de eventos -->
    <section class="section-anchor bg-dark" id="eventos" data-section="eventos">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'eventos' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🎉 Volver arriba
      </button>
      <EventsAgenda :events="blogStore.events" />
    </section>

    <!-- Guía de provincias -->
    <section
      class="section-anchor mx-auto max-w-page px-(--gutter) py-16"
      id="provincias"
      data-section="provincias"
      v-if="blogStore.provinces.length > 0"
    >
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'provincias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🧭 Volver arriba
      </button>
      <ProvincesIndex :provinces="blogStore.provinces" />
    </section>

    <!-- Artículos destacados -->
    <section
      class="section-anchor mx-auto max-w-page px-(--gutter) py-16"
      id="noticias"
      data-section="noticias"
      v-if="firestoreArticles.length > 0 || articlesLoading"
    >
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'noticias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        📰 Volver arriba
      </button>
      <FeaturedArticles :articles="firestoreArticles" :loading="articlesLoading" />
    </section>

    <!-- Guía práctica de servicios -->
    <section
      class="section-anchor bg-paper-alt"
      id="servicios"
      data-section="servicios"
      v-if="blogStore.services.length > 0"
    >
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'servicios' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        ✨ Volver arriba
      </button>
      <ServicesGuide :services="blogStore.services" />
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import { subscribeAllArticles, type Article } from '../services/articleService'
import AdBanner from '../components/AdBanner.vue'
import HeroSlider from '../components/HeroSlider.vue'
import SectionsIndex from '../components/SectionsIndex.vue'
import EventsAgenda from '../components/EventsAgenda.vue'
import ProvincesIndex from '../components/ProvincesIndex.vue'
import ServicesGuide from '../components/ServicesGuide.vue'
import FeaturedArticles from '../components/FeaturedArticles.vue'
import type { Slide } from '../types/blog'
import portada1Image from '../assets/portada1.jpg'
import portada2Image from '../assets/portada2.jpg'
import portada3Image from '../assets/portad3.jpg'
import bataImage from '../assets/Bata.jpg'
import imagenFondoImage from '../assets/imagen-fondo.png'

const router = useRouter()
const blogStore = useBlogStore()
const searchQuery = ref('')
const activeSection = ref<string | null>(null)
let sectionObserver: IntersectionObserver | null = null
const sectionRatios = new Map<string, number>()

const firestoreArticles = ref<Article[]>([])
const articlesLoading = ref(true)
let unsubscribeArticles: (() => void) | null = null

// Slides de portada con imágenes de fondo y textos
const portadaSlides = computed<Slide[]>(() => [
  {
    id: 1,
    imageUrl: portada1Image,
    title: 'Descubre Guinea Ecuatorial',
    subtitle: 'El corazón de África Central',
    link: '/about'
  },
  {
    id: 2,
    imageUrl: portada2Image,
    title: 'Cultura y Tradición',
    subtitle: 'Un legado ancestral vivo',
    link: '/post/cultura-guinea'
  },
  {
    id: 3,
    imageUrl: portada3Image,
    title: 'Naturaleza Exuberante',
    subtitle: 'Biodiversidad única en el mundo',
    link: '/post/naturaleza-guinea'
  }
])

// Exponer blogStore explícitamente para el template (Vue ya lo hace automáticamente)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implementar búsqueda
    console.log('Buscando:', searchQuery.value)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  unsubscribeArticles = subscribeAllArticles((articles) => {
    firestoreArticles.value = articles
    articlesLoading.value = false
  })

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.section
        if (!id) return
        sectionRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
      })

      let maxId: string | null = null
      let maxRatio = 0
      sectionRatios.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio
          maxId = id
        }
      })
      activeSection.value = maxRatio > 0 ? maxId : null
    },
    { threshold: [0.25, 0.4, 0.6, 0.8] }
  )

  document.querySelectorAll<HTMLElement>('section[data-section]').forEach((section) => {
    sectionObserver?.observe(section)
  })
})

onUnmounted(() => {
  unsubscribeArticles?.()
  unsubscribeArticles = null
  sectionObserver?.disconnect()
  sectionObserver = null
  sectionRatios.clear()
})
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 100%;
  background-color: #fff8f0;
  min-height: 100vh;
  position: relative;
}

.home-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* Imagen de fondo con opacidad reducida */
.home-content::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  opacity: 1;
  z-index: 0;
  pointer-events: none;
}

/* Overlay oscuro sobre la imagen de fondo para mejorar legibilidad */
.home-content::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  z-index: 1;
  pointer-events: none;
}

/* Contenido sobre el overlay */
.home-content > * {
  position: relative;
  z-index: 2;
}

/* Banner Superior */
.top-ad-banner {
  width: 100%;
}

/* Banner Full Width */
.full-width-banner {
  width: 100%;
  margin: 0;
}

.section-anchor {
  position: relative;
}

.back-to-top {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 5;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 0.75rem 1.1rem;
  background: rgba(17, 24, 39, 0.9);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px) rotate(-2deg);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  animation: floaty 3s ease-in-out infinite;
}

.back-to-top:hover,
.back-to-top:active {
  background: rgba(29, 78, 216, 0.95);
}

.back-to-top.show {
  opacity: 1;
  transform: translateY(0) rotate(0);
  pointer-events: auto;
}

@keyframes floaty {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .back-to-top {
    right: 1rem;
    bottom: 1rem;
    font-size: 0.85rem;
    padding: 0.6rem 0.9rem;
  }

}
</style>
