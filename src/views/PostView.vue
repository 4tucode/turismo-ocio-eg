<template>
  <div class="post-view">
    <!-- Skeleton de carga -->
    <div v-if="loading" class="post post--skeleton" aria-busy="true" aria-label="Cargando artículo">
      <div class="skeleton-back"></div>
      <article class="post-article">
        <div class="skeleton-hero"></div>
        <div class="skeleton-body">
          <div class="skeleton-line skeleton-line--h1"></div>
          <div class="skeleton-line skeleton-line--meta"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--short"></div>
        </div>
      </article>
    </div>

    <!-- Artículo cargado -->
    <div v-else-if="post" class="post">
      <button class="back-link" @click="goBack">← Volver</button>

      <article class="post-article">
        <div v-if="post.imageUrl" class="post-hero-image">
          <img :src="post.imageUrl" :alt="post.title" />
        </div>

        <h1>{{ post.title }}</h1>

        <div class="post-meta">
          <span class="date">{{ formatDate(post.date) }}</span>
          <span class="separator" aria-hidden="true">•</span>
          <span class="category">{{ formatCategory(post.category) }}</span>
          <span class="separator" aria-hidden="true">•</span>
          <span class="reading-time">{{ readingTime }} min de lectura</span>
        </div>
        <div class="post-divider" role="separator"></div>
        <div class="post-content" v-html="post.content"></div>
      </article>
    </div>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <h2>Post no encontrado</h2>
      <p>Lo sentimos, el post que buscas no existe.</p>
      <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { subscribeArticleBySlug, type Article } from '../services/articleService'

const route = useRoute()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const post = ref<Article | null>(null)
const loading = ref(true)
let unsubscribe: (() => void) | null = null

const readingTime = computed(() => {
  if (!post.value?.content) return 1
  const words = post.value.content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

onMounted(() => {
  unsubscribe = subscribeArticleBySlug(
    route.params.slug as string,
    (article) => {
      post.value = article
      loading.value = false
    },
    () => { loading.value = false }
  )
})

onUnmounted(() => {
  unsubscribe?.()
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCategory = (category?: string) => {
  if (!category) return ''
  const labels: Record<string, string> = {
    cultura: 'Cultura e Historia',
    gastronomia: 'Gastronomía',
    naturaleza: 'Naturaleza',
    ocio: 'Ocio',
    noticias: 'Noticias'
  }
  return labels[category] ?? (category.charAt(0).toUpperCase() + category.slice(1))
}
</script>

<style scoped>
.post-view {
  width: 70%;
  max-width: 980px;
  margin: 0 auto;
  padding-top: 140px;
  padding-bottom: 4rem;
}

.back-link {
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #42b983;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;
}

.back-link:hover,
.back-link:focus-visible {
  color: #35a372;
  text-decoration: underline;
}

.post-article {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.09);
}

.post-hero-image {
  width: 100%;
}

.post-hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-article h1 {
  color: #2c3e50;
  margin: 1.75rem 2rem 0.75rem;
  font-size: 2.25rem;
  line-height: 1.25;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  margin: 0 2rem 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  align-items: center;
}

.reading-time {
  color: #94a3b8;
}

.post-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0 2rem 1.5rem;
}

.post-content {
  color: #333;
  line-height: 1.85;
  padding: 0 2rem 2.5rem;
  font-size: 1.05rem;
}

.post-content :deep(h2) {
  color: #2c3e50;
  margin: 2rem 0 0.75rem;
  font-size: 1.5rem;
}

.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  color: #2c3e50;
  margin: 1.5rem 0 0.5rem;
  font-weight: 700;
}

.post-content :deep(p) { margin-bottom: 1.1rem; }

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 1rem 0 1.25rem;
  padding-left: 1.75rem;
}

.post-content :deep(ul) { list-style: disc; }
.post-content :deep(ol) { list-style: decimal; }

.post-content :deep(li) {
  margin: 0.4rem 0;
  line-height: 1.7;
}

.post-content :deep(li > ul),
.post-content :deep(li > ol) {
  margin: 0.25rem 0;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #42b983;
  margin: 1.25rem 0;
  padding: 0.5rem 1.25rem;
  color: #555;
  font-style: italic;
  background: #f8fffe;
  border-radius: 0 8px 8px 0;
}

.post-content :deep(pre) {
  background: #1e2433;
  color: #e2e8f0;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.25rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.post-content :deep(code) {
  background: #f0f4ff;
  color: #5a3fc0;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.88em;
}

.post-content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

.post-content :deep(strong) { font-weight: 700; color: #1e293b; }
.post-content :deep(em)     { font-style: italic; }

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

.post-content :deep(a) {
  color: #42b983;
  text-underline-offset: 3px;
}

/* Skeleton */
.post--skeleton {
  pointer-events: none;
}

.skeleton-back {
  height: 1.2rem;
  width: 120px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  margin-bottom: 2rem;
}

.skeleton-hero {
  width: 100%;
  height: 340px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-line {
  height: 0.9rem;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line--h1 { height: 2rem; width: 75%; }
.skeleton-line--meta { height: 0.75rem; width: 50%; }
.skeleton-line--short { width: 60%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-back,
  .skeleton-hero,
  .skeleton-line {
    animation: none;
    background: #e8e8e8;
  }
}

@media (max-width: 768px) {
  .post-view {
    width: 100%;
    padding: 120px 1rem 2rem;
  }

  .post-article h1 {
    font-size: 1.75rem;
    margin: 1.25rem 1.25rem 0.5rem;
  }

  .post-meta,
  .post-divider,
  .post-content {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
    padding-left: 0;
    padding-right: 0;
  }

  .post-content { padding-bottom: 2rem; }

  .skeleton-hero {
    height: 220px;
  }
}
</style>
