<template>
  <section class="category-section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <div class="header-line"></div>
    </div>
    <div class="posts-grid">
      <PostCard 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Post } from '../types/blog'
import PostCard from './PostCard.vue'

defineProps<{
  title: string
  posts: Post[]
}>()
</script>

<style scoped>
.category-section {
  margin-bottom: 4rem;
  padding: 1rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>

