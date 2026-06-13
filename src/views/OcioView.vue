<template>
  <div class="ocio">
    <div class="hero-section" :style="heroBg">
      <h1 class="hero-title">Ocio y Entretenimiento</h1>
      <p class="hero-subtitle">Disfruta de la vida nocturna, el entretenimiento y las actividades de ocio en Guinea Ecuatorial</p>
    </div>

    <section class="articles-section" aria-label="Artículos de Ocio y Entretenimiento">
      <div v-if="loading" class="articles-grid" aria-busy="true" aria-label="Cargando artículos">
        <div v-for="n in 3" :key="n" class="article-card skeleton-card" aria-hidden="true">
          <div class="skeleton-img"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--short"></div>
          </div>
        </div>
      </div>

      <div v-else-if="articles.length === 0" class="empty-state">
        <p class="empty-icon" aria-hidden="true">🎭</p>
        <h2>Próximamente</h2>
        <p>Estamos preparando artículos sobre ocio y entretenimiento. ¡Vuelve pronto!</p>
      </div>

      <div v-else class="articles-grid">
        <RouterLink
          v-for="article in articles"
          :key="article.id"
          :to="`/ocio/${article.slug}`"
          class="article-card"
        >
          <div class="article-image">
            <img :src="article.imageUrl || heroImage" :alt="article.title" loading="lazy" />
          </div>
          <div class="article-content">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div v-if="article.location" class="article-location">
              <span aria-hidden="true">📍</span> {{ article.location }}
            </div>
            <span class="read-more" aria-hidden="true">Leer más →</span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import heroImage from '../assets/paseo.jpg'
import type { Article } from '../services/articleService'
import { subscribeArticlesByCategory } from '../services/articleService'

const articles = ref<Article[]>([])
const loading = ref(true)
let unsubscribe: (() => void) | null = null

const heroBg = computed(() => ({
  backgroundImage: `linear-gradient(rgba(18,24,38,0.55), rgba(18,24,38,0.55)), url(${heroImage})`
}))

onMounted(() => {
  unsubscribe = subscribeArticlesByCategory('ocio', (data) => {
    articles.value = data
    loading.value = false
  })
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<style scoped>
.ocio {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-section {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.hero-title { font-size: 3rem; font-weight: bold; margin: 0 0 1rem 0; }
.hero-subtitle { font-size: 1.25rem; opacity: 0.95; max-width: 800px; margin: 0 auto; }

.articles-section { max-width: 1400px; margin: 0 auto; padding: 4rem 2rem; }

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.article-card:hover,
.article-card:focus-visible {
  transform: translateY(-5px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.16);
  outline: none;
}

.article-card:focus-visible {
  outline: 3px solid #fa709a;
  outline-offset: 2px;
}

.article-image { width: 100%; height: 220px; overflow: hidden; background: #e0e0e0; }

.article-image img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease;
}

.article-card:hover .article-image img { transform: scale(1.06); }

.article-content {
  padding: 1.5rem; flex: 1;
  display: flex; flex-direction: column; gap: 0.5rem;
}

.article-title { font-size: 1.25rem; color: #2c3e50; margin: 0; font-weight: 700; line-height: 1.35; }
.article-excerpt { color: #555; font-size: 0.95rem; line-height: 1.6; flex: 1; margin: 0; }
.article-location { color: #fa709a; font-size: 0.875rem; font-weight: 500; }
.read-more { color: #fa709a; font-size: 0.875rem; font-weight: 600; }

.skeleton-card { pointer-events: none; }

.skeleton-img {
  width: 100%; height: 220px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }

.skeleton-line {
  height: 0.85rem; border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line--title { height: 1.2rem; width: 80%; }
.skeleton-line--short { width: 50%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state { text-align: center; padding: 4rem 2rem; color: #666; }
.empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.empty-state h2 { font-size: 1.5rem; color: #2c3e50; margin-bottom: 0.75rem; }
.empty-state p { font-size: 1rem; max-width: 400px; margin: 0 auto; line-height: 1.6; }

@media (prefers-reduced-motion: reduce) {
  .skeleton-img, .skeleton-line { animation: none; background: #e8e8e8; }
  .article-image img, .article-card { transition: none; }
}

@media (max-width: 768px) {
  .hero-section {
    height: 70vh;
    background-attachment: scroll;
    padding: 3rem 1.5rem;
  }
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .articles-grid { grid-template-columns: 1fr; }
  .articles-section { padding: 2rem 1rem; }
}
</style>
