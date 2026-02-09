<template>
  <section class="provinces-section">
    <div class="section-header">
      <h2>Descubre las Provincias</h2>
      <div class="header-line"></div>
    </div>
    <div class="provinces-grid">
      <RouterLink
        v-for="province in provinces"
        :key="province.id"
        :to="`/post/${province.slug}`"
        class="province-btn"
      >
        <span class="province-icon">{{ province.icon }}</span>
        <span class="province-name">{{ province.name }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Province } from '../types/blog'

defineProps<{
  provinces: Province[]
}>()
</script>

<style scoped>
.provinces-section {
  margin: 4rem 0;
}

.section-header {
  margin-bottom: 2rem;
  text-align: center;
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
  margin: 0 auto;
}

.provinces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.province-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.province-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.province-icon {
  font-size: 2rem;
}

.province-name {
  font-weight: 600;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .provinces-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .province-btn {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>

