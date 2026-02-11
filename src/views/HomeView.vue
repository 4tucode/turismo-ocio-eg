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
    <section class="buttons-section">
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
    <section class="events-section" id="eventos" v-if="blogStore.events.length > 0">
      <h2 class="section-title">Eventos</h2>
      <p class="section-subtitle">
        Mantente al día con festivales, ferias y actividades culturales que hacen vibrar cada provincia.
      </p>
      <div class="events-grid">
        <RouterLink
          v-for="event in blogStore.events"
          :key="event.id"
          :to="`/evento/${event.slug}`"
          class="event-card"
          :class="{ 'event-card-with-bg': isEventWithBackground(event) }"
          :style="getEventBackground(event)"
        >
          <div class="event-image" v-if="!isEventWithBackground(event)">
            <img :src="event.imageUrl || ''" :alt="event.title" />
          </div>
          <div class="event-overlay" v-if="isEventWithBackground(event)"></div>
          <h3 class="event-title">{{ event.title }}</h3>
        </RouterLink>
      </div>
    </section>

    <!-- Sección Provincias -->
    <section class="provinces-section" id="provincias" v-if="blogStore.provinces.length > 0">
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
          <div class="province-overlay" v-if="isAnnobon(province) || isBioko(province) || isCentroSur(province) || isKieNtem(province) || isWeleNzas(province) || isLitoral(province)"></div>
          <span class="province-text">{{ province.name }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Sección Blog - Artículos Destacados -->
    <section class="blog-section" id="noticias" v-if="blogStore.featuredPosts.length > 0">
      <h2 class="section-title">Artículos Destacados</h2>
      <div class="articles-grid">
        <RouterLink
          v-for="article in blogStore.featuredPosts"
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
              <span class="article-author">{{ article.author }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Sección Servicios -->
    <section class="buttons-section">
      <h2 class="section-title">Servicios</h2>
      <p class="section-subtitle">
        Encuentra opciones de alquiler, alojamiento y agencias para planificar tu viaje con tranquilidad.
      </p>
      <div class="button-row">
        <RouterLink 
          v-if="blogStore.services.length > 0"
          to="/servicios/alquiler-coches" 
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[0]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Alquiler de Coches</span>
        </RouterLink>
        <RouterLink 
          v-if="blogStore.services.length > 1"
          to="/servicios/alquiler-casas" 
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[1]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Alquiler de Casas</span>
        </RouterLink>
        <RouterLink 
          v-if="blogStore.services.length > 2"
          to="/servicios/agencias-viajes" 
          class="circular-button"
          :style="{ backgroundImage: `url(${blogStore.services[2]?.imageUrl || ''})` }"
        >
          <div class="button-overlay"></div>
          <span class="button-text">Agencias de Viajes</span>
        </RouterLink>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'
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
import v2Video from '../assets/v2.mp4'

const router = useRouter()
const blogStore = useBlogStore()
const searchQuery = ref('')

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
    videoUrl: v2Video,
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
  if (isAnnobon(province)) {
    return {
      backgroundImage: `url(${annobonImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isBioko(province)) {
    return {
      backgroundImage: `url(${biokoImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isCentroSur(province)) {
    return {
      backgroundImage: `url(${centroSurImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isKieNtem(province)) {
    return {
      backgroundImage: `url(${kieNtemImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isWeleNzas(province)) {
    return {
      backgroundImage: `url(${weleNzasImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isLitoral(province)) {
    return {
      backgroundImage: `url(${litoralImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {}
}

const isMusicaTradicional = (event: any) => {
  const title = event.title?.toLowerCase() || ''
  const slug = event.slug?.toLowerCase() || ''
  return title.includes('música tradicional') || 
         title.includes('musica tradicional') ||
         slug.includes('musica-tradicional') ||
         slug.includes('música-tradicional')
}

const isArte = (event: any) => {
  const title = event.title?.toLowerCase() || ''
  const slug = event.slug?.toLowerCase() || ''
  return title.includes('arte') || 
         slug.includes('arte')
}

const isGastronomica = (event: any) => {
  const title = event.title?.toLowerCase() || ''
  const slug = event.slug?.toLowerCase() || ''
  return title.includes('gastronómica') || 
         title.includes('gastronomica') ||
         slug.includes('gastronomica') ||
         slug.includes('gastronómica')
}

const isDeportivo = (event: any) => {
  const title = event.title?.toLowerCase() || ''
  const slug = event.slug?.toLowerCase() || ''
  return title.includes('deportivo') || 
         title.includes('torneo') ||
         slug.includes('deportivo') ||
         slug.includes('torneo')
}

const isEventWithBackground = (event: any) => {
  return isMusicaTradicional(event) || isArte(event) || isGastronomica(event) || isDeportivo(event)
}

const getEventBackground = (event: any) => {
  if (isMusicaTradicional(event)) {
    return {
      backgroundImage: `url(${festivalImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isArte(event)) {
    return {
      backgroundImage: `url(${arteImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isGastronomica(event)) {
    return {
      backgroundImage: `url(${comidaGuineanaImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (isDeportivo(event)) {
    return {
      backgroundImage: `url(${deporteImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {}
}
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

.events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.event-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
}

.event-card:hover,
.event-card:active {
  transform: translateY(-5px);
}

.event-card-with-bg {
  position: relative;
  height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin-bottom: 1rem;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.event-card:hover .event-image img,
.event-card:active .event-image img {
  transform: scale(1.1);
}

.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1;
}

.event-title {
  font-size: 1.2rem;
  color: #2c3e50;
  text-align: center;
  margin: 0;
}

.event-card-with-bg .event-title {
  position: relative;
  z-index: 2;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  padding: 1rem;
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
  font-size: 0.8rem;
  color: #999;
  margin-top: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .events-grid,
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .provinces-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
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

  .events-grid,
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
