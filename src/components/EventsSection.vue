<template>
  <section class="events-section">
    <div class="section-header">
      <h2>Próximos Eventos</h2>
      <div class="header-line"></div>
    </div>
    <div class="events-grid">
      <RouterLink
        v-for="event in events"
        :key="event.id"
        :to="`/post/${event.slug}`"
        class="event-card"
      >
        <div class="event-image">
          <img :src="event.imageUrl" :alt="event.title" />
          <div class="event-date">{{ formatDate(event.date) }}</div>
        </div>
        <div class="event-content">
          <h3>{{ event.title }}</h3>
          <p>{{ event.excerpt }}</p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Event } from '../types/blog'

defineProps<{
  events: Event[]
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.events-section {
  margin: 4rem 0;
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

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.event-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-date {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.event-content {
  padding: 1.5rem;
}

.event-content h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.event-content p {
  color: #666;
  line-height: 1.6;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>

