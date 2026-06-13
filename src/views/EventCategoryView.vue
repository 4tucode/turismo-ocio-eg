<template>
  <div class="event-category-view">
    <!-- Hero de categoría -->
    <div class="hero-section" :style="heroBg">
      <div class="hero-content">
        <h1 class="hero-title">{{ categoryLabel }}</h1>
        <p class="hero-subtitle">{{ categorySubtitle }}</p>
      </div>
    </div>

    <div class="page-body">
      <!-- Migas de pan -->
      <nav class="breadcrumbs" aria-label="Navegación de ruta">
        <RouterLink to="/" class="breadcrumb-link">Inicio</RouterLink>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <RouterLink to="/#eventos" class="breadcrumb-link">Eventos</RouterLink>
        <span class="breadcrumb-sep" aria-hidden="true">›</span>
        <span class="breadcrumb-current" aria-current="page">{{ categoryLabel }}</span>
      </nav>

      <!-- Buscador -->
      <div class="search-bar-wrapper">
        <label for="event-search" class="sr-only">Buscar eventos</label>
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="event-search"
            v-model="searchQuery"
            type="search"
            class="search-input"
            placeholder="Buscar eventos por nombre o descripción…"
            autocomplete="off"
          />
          <button
            v-if="searchQuery"
            class="search-clear"
            @click="searchQuery = ''"
            aria-label="Limpiar búsqueda"
          >✕</button>
        </div>
        <p v-if="searchQuery && !loading" class="search-results-info" aria-live="polite">
          {{ filteredEvents.length === 0
            ? 'Sin resultados para "' + searchQuery + '"'
            : filteredEvents.length + ' resultado' + (filteredEvents.length > 1 ? 's' : '') }}
        </p>
      </div>

      <!-- Skeleton de carga -->
      <div v-if="loading" class="events-grid" aria-busy="true" aria-label="Cargando eventos">
        <div v-for="n in 4" :key="n" class="event-card skeleton-card" aria-hidden="true">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--short"></div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="filteredEvents.length === 0" class="empty-state">
        <p class="empty-icon" aria-hidden="true">{{ searchQuery ? '🔍' : categoryMeta.icon }}</p>
        <h2>{{ searchQuery ? 'Sin resultados' : 'No hay eventos todavía' }}</h2>
        <p>
          {{ searchQuery
            ? `No se encontraron eventos que coincidan con "${searchQuery}".`
            : 'Pronto publicaremos eventos en esta categoría. ¡Vuelve pronto!' }}
        </p>
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''">
          Limpiar búsqueda
        </button>
      </div>

      <!-- Grid de eventos -->
      <TransitionGroup v-else name="cards" tag="div" class="events-grid">
        <article
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
        >
          <div class="card-image" v-if="event.imageUrl">
            <img :src="event.imageUrl" :alt="event.title" loading="lazy" />
          </div>
          <div class="card-image card-image--placeholder" v-else aria-hidden="true">
            <span>{{ categoryMeta.icon }}</span>
          </div>
          <div class="card-body">
            <span class="card-category-badge">{{ categoryLabel }}</span>
            <h2 class="card-title">{{ event.title }}</h2>
            <p v-if="event.excerpt" class="card-excerpt">{{ event.excerpt }}</p>
            <div class="card-footer">
              <span v-if="event.date" class="card-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ formatDate(event.date) }}
              </span>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { subscribeEvents, type FirestoreEvent } from '../services/eventService'
import type { EventCategory } from '../types/blog'
import festivalImage from '../assets/festival.jpg'
import arteImage from '../assets/arte.jpg'
import comidaImage from '../assets/comidaguineana.jpg'
import deporteImage from '../assets/deporte.jfif'

const route = useRoute()

const CATEGORY_META: Record<EventCategory, { label: string; subtitle: string; icon: string; bg: string }> = {
  musical:     { label: 'Musicales',     subtitle: 'Festivales, conciertos y actuaciones de música y danza tradicional.', icon: '🎵', bg: festivalImage },
  artistico:   { label: 'Artísticos',    subtitle: 'Exposiciones, teatro y manifestaciones culturales del país.',          icon: '🎨', bg: arteImage },
  gastronomico:{ label: 'Gastronómicos', subtitle: 'Ferias y degustaciones de la rica cocina ecuatoguineana.',             icon: '🍽️', bg: comidaImage },
  deportivo:   { label: 'Deportivos',    subtitle: 'Torneos, competencias y eventos deportivos de todas las disciplinas.', icon: '⚽', bg: deporteImage },
}

const category = computed(() => route.params.category as EventCategory)
const categoryMeta = computed(() => CATEGORY_META[category.value] ?? { label: category.value, subtitle: '', icon: '📅', bg: '' })
const categoryLabel = computed(() => categoryMeta.value.label)
const categorySubtitle = computed(() => categoryMeta.value.subtitle)
const heroBg = computed(() => ({
  backgroundImage: `linear-gradient(rgba(10,15,30,0.55), rgba(10,15,30,0.65)), url(${categoryMeta.value.bg})`
}))

const allEvents = ref<FirestoreEvent[]>([])
const loading = ref(true)
const searchQuery = ref('')
let unsubscribe: (() => void) | null = null

const categoryEvents = computed(() =>
  allEvents.value.filter(e => e.category === category.value)
)

const filteredEvents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categoryEvents.value
  return categoryEvents.value.filter(e =>
    e.title.toLowerCase().includes(q) ||
    (e.excerpt ?? '').toLowerCase().includes(q)
  )
})

onMounted(() => {
  unsubscribe = subscribeEvents(events => {
    allEvents.value = events
    loading.value = false
  })
})

onUnmounted(() => {
  unsubscribe?.()
})

const formatDate = (d: string) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.event-category-view {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Hero */
.hero-section {
  height: 55vh;
  min-height: 320px;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  padding: 2rem;
  max-width: 700px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.75rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  line-height: 1.6;
  margin: 0;
}

/* Cuerpo */
.page-body {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
}

/* Migas de pan */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.breadcrumb-link:hover { color: #4a5cc4; text-decoration: underline; }

.breadcrumb-sep { color: #aaa; font-size: 1rem; }

.breadcrumb-current {
  color: #555;
  font-weight: 600;
}

/* Buscador */
.search-bar-wrapper {
  margin-bottom: 2rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 520px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #999;
  pointer-events: none;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 0.8rem 2.75rem 0.8rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 999px;
  font-size: 0.95rem;
  background: white;
  color: #2c3e50;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.18);
}

.search-input::placeholder { color: #aaa; }

/* Quitar UI nativa del type=search */
.search-input::-webkit-search-cancel-button { -webkit-appearance: none; }

.search-clear {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}

.search-clear:hover { color: #555; }

.search-results-info {
  margin: 0.6rem 0 0 1rem;
  font-size: 0.85rem;
  color: #777;
}

/* Accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
}

/* Tarjeta evento */
.event-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.09);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.14);
}

.card-image {
  width: 100%;
  height: 210px;
  overflow: hidden;
  background: #e8eaf0;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.event-card:hover .card-image img { transform: scale(1.06); }

.card-image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
}

.card-body {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-category-badge {
  display: inline-block;
  background: #eef0fd;
  color: #667eea;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  align-self: flex-start;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.35;
}

.card-excerpt {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.card-footer {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #999;
}

.card-date svg {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }

.empty-state h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 1rem;
  max-width: 420px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.btn-clear-search {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-clear-search:hover { background: #4a5cc4; }

/* Skeleton */
.skeleton-card { pointer-events: none; }

.skeleton-img {
  width: 100%;
  height: 210px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line {
  height: 0.85rem;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line--title { height: 1.2rem; width: 80%; }
.skeleton-line--short { width: 45%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Transición de tarjetas */
.cards-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.cards-leave-active { transition: opacity 0.2s ease; position: absolute; }
.cards-enter-from   { opacity: 0; transform: translateY(14px); }
.cards-leave-to     { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .skeleton-img, .skeleton-line { animation: none; background: #e8e8e8; }
  .event-card, .card-image img { transition: none; }
  .cards-enter-active, .cards-leave-active { transition: none; }
}

@media (max-width: 768px) {
  .hero-section {
    height: 45vh;
    min-height: 260px;
    background-attachment: scroll;
  }

  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }

  .page-body { padding: 1.5rem 1rem 3rem; }

  .search-bar { max-width: 100%; }

  .events-grid { grid-template-columns: 1fr; }
}
</style>
