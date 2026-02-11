<template>
  <div class="post-view">
    <div v-if="post" class="post">
      <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>
      
      <article class="post-article">
        <div v-if="post.imageUrl" class="post-hero-image">
          <img :src="post.imageUrl" :alt="post.title" />
        </div>
        
        <h1>{{ post.title }}</h1>
        
        <div class="post-meta">
          <span class="date">{{ formatDate(post.date) }}</span>
          <span class="separator">•</span>
          <span class="category">{{ formatCategory(post.category) }}</span>
        </div>
        <div class="post-divider"></div>
        <div class="post-content" v-html="post.content"></div>
        
        <div class="tags" v-if="post.tags?.length">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </article>
    </div>
    
    <div v-else class="not-found">
      <h2>Post no encontrado</h2>
      <p>Lo sentimos, el post que buscas no existe.</p>
      <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const post = computed(() => {
  return blogStore.getPostBySlug(route.params.slug as string)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatCategory = (category?: string) => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>

<style scoped>
.post-view {
  width: 70%;
  max-width: 980px;
  margin: 0 auto;
  padding-top: 140px;
}

.back-link {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #35a372;
}

.post-article {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-hero-image {
  width: 100%;
  height: 400px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.post-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-article h1 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.post-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
}

.post-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0 1.5rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.tag {
  background: #e8f4f8;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.post-content {
  color: #333;
  line-height: 1.8;
}

.post-content :deep(h2) {
  color: #2c3e50;
  margin: 1.5rem 0 0.75rem;
  font-size: 1.5rem;
}

.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  color: #2c3e50;
  margin: 1rem 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
}

.post-content :deep(p) {
  margin-bottom: 1rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .post-view {
    width: 100%;
    padding: 120px 1rem 0;
  }

  .post-article h1 {
    font-size: 2rem;
  }
  
  .post-hero-image {
    height: 250px;
  }
}
</style>

