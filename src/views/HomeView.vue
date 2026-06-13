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

    <!-- Sección de Botones -->
    <section class="buttons-section section-anchor" id="categorias" data-section="categorias">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'categorias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🚀 Volver arriba
      </button>
      <h2 class="section-title">Categorías</h2>
      <p class="section-subtitle">
        Selecciona una de nuestras categorías y descubre rutas, sabores, tradiciones y planes para cada tipo de viajero.
      </p>
      <!-- Primera Fila -->
      <div class="button-row">
        <RouterLink 
          to="/cultura" 
          class="circular-button cultura-button"
          :style="{ backgroundImage: `url(${culturaImage})` }"
        >
          <div class="button-overlay cultura-overlay"></div>
          <span class="button-text cultura-text">Cultura e Historia</span>
        </RouterLink>
        <RouterLink 
          to="/naturaleza" 
          class="circular-button"
          :style="{ backgroundImage: `url(${getCategoryImage('naturaleza')})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Naturaleza y Aventura</span>
        </RouterLink>
        <RouterLink 
          to="/gastronomia" 
          class="circular-button"
          :style="{ backgroundImage: `url(${getCategoryImage('gastronomia')})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Gastronomía</span>
        </RouterLink>
        <RouterLink 
          to="/ocio" 
          class="circular-button"
          :style="{ backgroundImage: `url(${getCategoryImage('ocio')})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Ocio y Entretenimiento</span>
        </RouterLink>
      </div>

    </section>

    <!-- Sección Próximos Eventos -->
    <section class="events-section section-anchor" id="eventos" data-section="eventos">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'eventos' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🎉 Volver arriba
      </button>
      <h2 class="section-title">Eventos</h2>
      <p class="section-subtitle">
        Mantente al día con festivales, ferias y actividades culturales que hacen vibrar cada provincia.
      </p>

      <!-- Filtros de categoría -->
      <div class="event-categories" role="group" aria-label="Filtrar eventos por categoría">
        <button
          v-for="cat in EVENT_CATEGORIES"
          :key="cat.key"
          class="event-cat-btn"
          :class="{ active: selectedEventCategory === cat.key }"
          :style="{ backgroundImage: `url(${cat.bg})` }"
          @click="toggleEventCategory(cat.key)"
          :aria-pressed="selectedEventCategory === cat.key"
        >
          <div class="event-cat-overlay"></div>
          <span class="event-cat-label">{{ cat.label }}</span>
          <span v-if="eventCountByCategory(cat.key) > 0" class="event-cat-count">
            {{ eventCountByCategory(cat.key) }}
          </span>
        </button>
      </div>

      <!-- Lista de eventos filtrados -->
      <TransitionGroup
        v-if="filteredEvents.length > 0"
        name="ev-list"
        tag="div"
        class="events-list"
      >
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-list-card"
        >
          <div v-if="event.imageUrl" class="event-list-img">
            <img :src="event.imageUrl" :alt="event.title" loading="lazy" />
          </div>
          <div class="event-list-body">
            <h3 class="event-list-title">{{ event.title }}</h3>
            <p v-if="event.excerpt" class="event-list-excerpt">{{ event.excerpt }}</p>
            <span v-if="event.date" class="event-list-date">📅 {{ formatDate(event.date) }}</span>
          </div>
        </div>
      </TransitionGroup>

      <p v-else-if="selectedEventCategory" class="events-empty">
        No hay eventos en esta categoría todavía.
      </p>
    </section>

    <!-- Sección Provincias -->
    <section class="provinces-section section-anchor" id="provincias" data-section="provincias" v-if="blogStore.provinces.length > 0">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'provincias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        🧭 Volver arriba
      </button>
      <h2 class="section-title">Nuestras Provincias</h2>
      <p class="section-subtitle">
        Explora cada provincia y descubre sus paisajes, su gente y sus lugares más emblemáticos.
      </p>
      <div class="provinces-grid">
        <RouterLink
          v-for="province in blogStore.provinces"
          :key="province.id"
          :to="`/provincia/${province.slug}`"
          class="province-button"
          :style="getProvinceBackground(province)"
        >
          <div class="province-overlay" v-if="province.imageUrl || isAnnobon(province) || isBioko(province) || isCentroSur(province) || isKieNtem(province) || isWeleNzas(province) || isLitoral(province)"></div>
          <span class="province-text">{{ province.name }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Sección Blog - Artículos Destacados -->
    <section class="blog-section section-anchor" id="noticias" data-section="noticias" v-if="firestoreArticles.length > 0 || articlesLoading">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'noticias' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        📰 Volver arriba
      </button>
      <h2 class="section-title">Artículos Destacados</h2>
      <p class="section-subtitle">Últimas publicaciones de nuestros colaboradores sobre Guinea Ecuatorial</p>

      <!-- Skeleton de carga -->
      <div v-if="articlesLoading" class="articles-grid" aria-busy="true" aria-label="Cargando artículos">
        <div v-for="n in 4" :key="n" class="article-card skeleton-card" aria-hidden="true">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--short"></div>
          </div>
        </div>
      </div>

      <TransitionGroup v-else name="articles" tag="div" class="articles-grid">
        <RouterLink
          v-for="article in paginatedArticles"
          :key="article.id"
          :to="`/post/${article.slug}`"
          class="article-card"
        >
          <div v-if="article.imageUrl" class="article-image">
            <img :src="article.imageUrl" :alt="article.title" />
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span class="article-date">{{ formatDate(article.date) }}</span>
              <span class="article-read-more" aria-hidden="true">Leer →</span>
            </div>
          </div>
        </RouterLink>
      </TransitionGroup>
      <div class="pagination" v-if="totalPages > 1">
        <button
          class="pagination-btn"
          :disabled="currentPage === 0"
          @click="goToPage(currentPage - 1)"
          aria-label="Página anterior"
        >&#8592;</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-btn pagination-num"
          :class="{ active: currentPage === page - 1 }"
          @click="goToPage(page - 1)"
        >{{ page }}</button>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages - 1"
          @click="goToPage(currentPage + 1)"
          aria-label="Página siguiente"
        >&#8594;</button>
      </div>
    </section>

    <!-- Sección Servicios -->
    <section class="buttons-section section-anchor" id="servicios" data-section="servicios">
      <button
        class="back-to-top"
        :class="{ show: activeSection === 'servicios' }"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
      >
        ✨ Volver arriba
      </button>
      <h2 class="section-title">Servicios</h2>
      <p class="section-subtitle">
        Encuentra opciones de alquiler, alojamiento y agencias para planificar tu viaje con tranquilidad.
      </p>
      <div class="button-row">
        <div
          v-if="blogStore.services.length > 0"
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[0]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Alquiler de Coches</span>
        </div>
        <div
          v-if="blogStore.services.length > 1"
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[1]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Alquiler de Casas</span>
        </div>
        <div
          v-if="blogStore.services.length > 2"
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[2]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Agencias de Viajes</span>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { EventCategory } from '../types/blog'
import { useRouter, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import { subscribeAllArticles, type Article } from '../services/articleService'
import AdBanner from '../components/AdBanner.vue'
import HeroSlider from '../components/HeroSlider.vue'
import type { Slide } from '../types/blog'
import annobonImage from '../assets/Annobón.png'
import biokoImage from '../assets/Bioko.png'
import centroSurImage from '../assets/centro-sur-location-map.jpg'
import kieNtemImage from '../assets/Kié-Ntem_in_Equatorial_Guinea_2020.svg'
import weleNzasImage from '../assets/Wele-Nzas_in_Equatorial_Guinea_2020.svg.png'
import litoralImage from '../assets/Litoral_in_Equatorial_Guinea_2020.svg.png'
import festivalImage from '../assets/festival.jpg'
import arteImage from '../assets/arte.jpg'
import comidaGuineanaImage from '../assets/comidaguineana.jpg'
import deporteImage from '../assets/deporte.jfif'
import culturaImage from '../assets/cultura.webp'
import portada1Image from '../assets/portada1.jpg'
import portada2Image from '../assets/portada2.jpg'
import portada3Image from '../assets/portad3.jpg'
import bataImage from '../assets/Bata.jpg'
import imagenFondoImage from '../assets/imagen-fondo.png'
import v1Video from '../assets/v1.mp4'

const router = useRouter()
const blogStore = useBlogStore()
const searchQuery = ref('')
const activeSection = ref<string | null>(null)
let sectionObserver: IntersectionObserver | null = null
const sectionRatios = new Map<string, number>()

const firestoreArticles = ref<Article[]>([])
const articlesLoading = ref(true)
let unsubscribeArticles: (() => void) | null = null

const ARTICLES_PER_PAGE = 4
const currentPage = ref(0)
const totalPages = computed(() => Math.ceil(firestoreArticles.value.length / ARTICLES_PER_PAGE))
const paginatedArticles = computed(() =>
  firestoreArticles.value.slice(currentPage.value * ARTICLES_PER_PAGE, (currentPage.value + 1) * ARTICLES_PER_PAGE)
)

const goToPage = (page: number) => {
  currentPage.value = page
}

// Slides de portada con vídeos de fondo (v1, v2) y textos
const portadaSlides = computed<Slide[]>(() => [
  {
    id: 1,
    imageUrl: portada1Image,
    videoUrl: v1Video,
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
    videoUrl: v1Video,
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

const getCategoryImage = (category: string) => {
  const categoryPosts = blogStore.getPostsByCategory(category)
  if (categoryPosts && categoryPosts.length > 0 && categoryPosts[0]?.imageUrl) {
    return categoryPosts[0].imageUrl
  }
  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch (error) {
    return dateString
  }
}

const isAnnobon = (province: any) => {
  return province.name?.toLowerCase().includes('annobón') || 
         province.name?.toLowerCase().includes('annobon') ||
         province.slug?.toLowerCase().includes('annobon')
}

const isBioko = (province: any) => {
  const name = province.name?.toLowerCase() || ''
  const slug = province.slug?.toLowerCase() || ''
  return name.includes('bioko norte') || 
         name.includes('bioko sur') ||
         slug.includes('bioko-norte') ||
         slug.includes('bioko-sur')
}

const isCentroSur = (province: any) => {
  const name = province.name?.toLowerCase() || ''
  const slug = province.slug?.toLowerCase() || ''
  return name.includes('centro sur') || 
         slug.includes('centro-sur')
}

const isKieNtem = (province: any) => {
  const name = province.name?.toLowerCase() || ''
  const slug = province.slug?.toLowerCase() || ''
  return name.includes('kié-ntem') || 
         name.includes('kie ntem') ||
         name.includes('kie-ntem') ||
         slug.includes('kie-ntem') ||
         slug.includes('kié-ntem')
}

const isWeleNzas = (province: any) => {
  const name = province.name?.toLowerCase() || ''
  const slug = province.slug?.toLowerCase() || ''
  return name.includes('wele-nzas') || 
         name.includes('wele nzas') ||
         slug.includes('wele-nzas')
}

const isLitoral = (province: any) => {
  const name = province.name?.toLowerCase() || ''
  const slug = province.slug?.toLowerCase() || ''
  return name.includes('litoral') || 
         slug.includes('litoral')
}

const getProvinceBackground = (province: any) => {
  const bg = (url: string) => ({ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' })
  if (province.imageUrl) return bg(province.imageUrl)
  if (isAnnobon(province)) return bg(annobonImage)
  if (isBioko(province)) return bg(biokoImage)
  if (isCentroSur(province)) return bg(centroSurImage)
  if (isKieNtem(province)) return bg(kieNtemImage)
  if (isWeleNzas(province)) return bg(weleNzasImage)
  if (isLitoral(province)) return bg(litoralImage)
  return {}
}

// Categorías de eventos
const EVENT_CATEGORIES = [
  { key: 'musical' as EventCategory,     label: 'Musicales',     bg: festivalImage },
  { key: 'artistico' as EventCategory,   label: 'Artísticos',    bg: arteImage },
  { key: 'gastronomico' as EventCategory,label: 'Gastronómicos', bg: comidaGuineanaImage },
  { key: 'deportivo' as EventCategory,   label: 'Deportivos',    bg: deporteImage },
]

const selectedEventCategory = ref<EventCategory | null>(null)

const toggleEventCategory = (key: EventCategory) => {
  selectedEventCategory.value = selectedEventCategory.value === key ? null : key
}

const filteredEvents = computed(() => {
  if (!selectedEventCategory.value) return []
  return blogStore.events.filter(e => e.category === selectedEventCategory.value)
})

const eventCountByCategory = (key: EventCategory) =>
  blogStore.events.filter(e => e.category === key).length

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

/* Sección de Botones */
.buttons-section {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
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

.button-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.circular-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.circular-button:hover,
.circular-button:active {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1;
}

.button-text {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  padding: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.cultura-overlay {
  background: rgba(0, 0, 0, 0.6) !important;
}

.cultura-text {
  color: #ffffff !important;
  font-weight: 900 !important;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
}

/* Sección Eventos */
.events-section {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Filtros de categoría */
.event-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.event-cat-btn {
  position: relative;
  height: 160px;
  border-radius: 16px;
  border: 3px solid transparent;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 0;
  transition: transform 0.25s, border-color 0.2s, box-shadow 0.25s;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}

.event-cat-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.25);
}

.event-cat-btn.active {
  border-color: #fff;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.6), 0 10px 28px rgba(0,0,0,0.25);
  transform: translateY(-4px);
}

.event-cat-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 60%);
  transition: background 0.25s;
}

.event-cat-btn.active .event-cat-overlay,
.event-cat-btn:hover .event-cat-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 60%);
}

.event-cat-label {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0.85rem 1rem 0.75rem;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

.event-cat-count {
  position: absolute;
  top: 0.6rem;
  right: 0.7rem;
  z-index: 1;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.35);
}

/* Lista de eventos filtrados */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-list-card {
  display: flex;
  gap: 1.25rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.13);
}

.event-list-img {
  width: 160px;
  flex-shrink: 0;
  overflow: hidden;
}

.event-list-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.event-list-card:hover .event-list-img img {
  transform: scale(1.05);
}

.event-list-body {
  padding: 1.1rem 1.1rem 1.1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  justify-content: center;
}

.event-list-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.event-list-excerpt {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.55;
  margin: 0;
}

.event-list-date {
  font-size: 0.8rem;
  color: #999;
}

.events-empty {
  text-align: center;
  color: #888;
  padding: 2rem 0;
  font-size: 0.95rem;
}

/* Animación lista de eventos */
.ev-list-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.ev-list-leave-active { transition: opacity 0.2s ease; }
.ev-list-enter-from   { opacity: 0; transform: translateY(12px); }
.ev-list-leave-to     { opacity: 0; }

.section-title {
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.section-subtitle {
  max-width: 720px;
  margin: -1rem auto 2.5rem;
  text-align: center;
  color: #5b6b7a;
  font-size: 1.05rem;
  line-height: 1.6;
}


/* Sección Provincias */
.provinces-section {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.provinces-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.province-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin: 0 auto;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}

.province-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1;
}

.province-button:hover,
.province-button:active {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.province-text {
  padding: 1rem;
  position: relative;
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

/* Sección Blog */
.blog-section {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.article-card {
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.article-card:hover,
.article-card:active {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img,
.article-card:active .article-image img {
  transform: scale(1.1);
}

@media (hover: none) {
  .circular-button:active {
    transform: scale(1.04);
  }

  .event-card:active {
    transform: translateY(-3px);
  }

  .province-button:active {
    transform: scale(1.06);
  }

  .article-card:active {
    transform: translateY(-3px);
  }
}

.article-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.article-excerpt {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
  margin-top: auto;
}

.article-read-more {
  color: #667eea;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: nowrap;
}

/* Skeleton artículos home */
.skeleton-card {
  pointer-events: none;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.07);
}

.skeleton-img {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: home-shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line {
  height: 0.8rem;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: home-shimmer 1.4s infinite;
}

.skeleton-line--title { height: 1.1rem; width: 85%; }
.skeleton-line--short { width: 45%; }

@keyframes home-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-img, .skeleton-line { animation: none; background: #e8e8e8; }
}

/* Animación artículos */
.articles-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.articles-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.articles-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.articles-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.articles-move {
  transition: transform 0.4s ease;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
}

.pagination-btn {
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}

.pagination-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: scale(1.05);
}

.pagination-btn.active {
  background: #2c3e50;
  border-color: #2c3e50;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1200px) {
  .event-categories {
    grid-template-columns: repeat(2, 1fr);
  }

  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .provinces-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .back-to-top {
    right: 1rem;
    bottom: 1rem;
    font-size: 0.85rem;
    padding: 0.6rem 0.9rem;
  }

  .button-row {
    gap: 1rem;
    justify-content: center;
  }

  .circular-button {
    width: 140px;
    height: 140px;
    max-width: 180px;
  }

  .button-text {
    font-size: 0.9rem;
  }

  .event-categories {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .event-cat-btn {
    height: 120px;
  }

  .event-list-img {
    width: 110px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .provinces-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .province-button {
    width: 150px;
    height: 150px;
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 0.95rem;
    margin: -0.5rem auto 2rem;
    padding: 0 0.5rem;
  }
}
</style>
