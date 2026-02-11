<template>
  <div class="cultura-article">
    <div v-if="article" class="article-container">
      <RouterLink :to="getBackLink()" class="back-link">← Volver</RouterLink>
      
      <article class="article-content">
        <div v-if="article.imageUrl" class="article-hero-image">
          <img :src="article.imageUrl" :alt="article.title" />
        </div>
        
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div v-if="article.location" class="article-meta">
            <span class="location">📍 {{ article.location }}</span>
          </div>
        </div>
        
        <div class="article-body" v-html="article.content"></div>
      </article>
    </div>
    
    <div v-else class="not-found">
      <h2>Artículo no encontrado</h2>
      <RouterLink to="/" class="back-link">Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const article = computed(() => {
  const slug = route.params.slug as string
  return blogStore.getCulturaArticleBySlug(slug)
})

const getBackLink = () => {
  if (!article.value) return '/'
  const category = article.value.category || 'cultura'
  const categoryMap: Record<string, string> = {
    'cultura': '/cultura',
    'gastronomia': '/gastronomia',
    'naturaleza': '/naturaleza',
    'ocio': '/ocio'
  }
  return categoryMap[category] || '/cultura'
}
</script>

<style scoped>
.cultura-article {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 140px 0 2rem;
}

.article-container {
  width: 70%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 2rem;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #764ba2;
}

.article-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.article-hero-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #e0e0e0;
}

.article-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-header {
  padding: 3rem 3rem 1rem;
}

.article-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: bold;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.location {
  color: #667eea;
  font-weight: 500;
}

.article-body {
  padding: 0 3rem 3rem;
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
}

.article-body :deep(h1) {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1.5rem 0 0.75rem;
  font-weight: bold;
}

.article-body :deep(h2) {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 1.5rem 0 0.75rem;
  font-weight: bold;
}

.article-body :deep(h3) {
  font-size: 1.15rem;
  color: #2c3e50;
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  font-size: 1.05rem;
  color: #2c3e50;
  margin: 0.75rem 0 0.5rem;
  font-weight: 600;
}

.article-body :deep(p) {
  margin: 1rem 0;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-body :deep(li) {
  margin: 0.5rem 0;
}

.article-body :deep(strong) {
  font-weight: 600;
  color: #2c3e50;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.not-found h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .article-container {
    width: 100%;
    padding: 0 1rem;
  }

  .cultura-article {
    padding: 120px 0 2rem;
  }

  .article-header,
  .article-body {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .article-title {
    font-size: 1.75rem;
  }

  .article-hero-image {
    height: 250px;
  }

  .article-body {
    font-size: 1rem;
  }

  .article-body :deep(h1) {
    font-size: 1.5rem;
  }

  .article-body :deep(h2) {
    font-size: 1.25rem;
  }

  .article-body :deep(h3) {
    font-size: 1.1rem;
  }
}
</style>
