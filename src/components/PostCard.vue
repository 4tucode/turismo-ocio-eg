<template>
  <article class="post-card">
    <div v-if="post.imageUrl" class="post-image">
      <img :src="post.imageUrl" :alt="post.title" />
    </div>
    <div class="post-content">
      <h2>{{ post.title }}</h2>
      <div class="post-meta">
        <span class="author">Por {{ post.author }}</span>
        <span class="date">{{ formatDate(post.date) }}</span>
      </div>
      <p class="excerpt">{{ post.excerpt }}</p>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <RouterLink :to="`/post/${post.slug}`" class="read-more">
        Leer más →
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Post } from '../types/blog'

defineProps<{
  post: Post
}>()

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
.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-content h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #e8f4f8;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.read-more {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.read-more:hover {
  color: #35a372;
}
</style>

