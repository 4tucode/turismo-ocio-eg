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
          <span class="author">Por {{ post.author }}</span>
          <span class="date">{{ formatDate(post.date) }}</span>
        </div>
        
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        
        <div class="post-content" v-html="post.content"></div>
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
</script>

<style scoped>
.post-view {
  max-width: 800px;
  margin: 0 auto;
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
  margin: -2rem -2rem 2rem;
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
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 0.875rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
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
  margin: 2rem 0 1rem;
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
  .post-article h1 {
    font-size: 2rem;
  }
  
  .post-hero-image {
    height: 250px;
  }
}
</style>

