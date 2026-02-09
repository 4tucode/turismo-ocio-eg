<template>
  <section class="sponsors-section">
    <h3>Nuestros Patrocinadores</h3>
    <div class="sponsors-grid">
      <a
        v-for="sponsor in sponsors"
        :key="sponsor.id"
        :href="sponsor.website"
        target="_blank"
        rel="noopener noreferrer"
        class="sponsor-card"
        :title="sponsor.name"
      >
        <img :src="sponsor.logo" :alt="sponsor.name" />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Sponsor } from '../types/blog'

defineProps<{
  sponsors: Sponsor[]
}>()
</script>

<style scoped>
.sponsors-section {
  background: white;
  padding: 2rem;
  margin: 3rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sponsors-section h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.sponsors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  align-items: center;
  justify-items: center;
}

.sponsor-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: transform 0.3s, opacity 0.3s;
  border-radius: 8px;
}

.sponsor-card:hover {
  transform: translateY(-4px);
  opacity: 0.8;
}

.sponsor-card img {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .sponsors-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .sponsor-card img {
    max-width: 120px;
    max-height: 60px;
  }
}
</style>

