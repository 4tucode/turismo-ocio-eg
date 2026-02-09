<template>
  <section class="services-section">
    <div class="section-header">
      <h2>Servicios</h2>
      <div class="header-line"></div>
    </div>
    <div class="services-grid">
      <RouterLink to="/hospedaje" class="service-card">
        <div class="service-icon">🏨</div>
        <h3>Hospedaje</h3>
        <p>Encuentra los mejores hoteles y alojamientos</p>
      </RouterLink>
      
      <RouterLink to="/transporte" class="service-card">
        <div class="service-icon">🚗</div>
        <h3>Transporte</h3>
        <p>Opciones de transporte y movilidad</p>
      </RouterLink>
      
      <RouterLink to="/guias" class="service-card">
        <div class="service-icon">🗺️</div>
        <h3>Guías Turísticas</h3>
        <p>Expertos locales para tu viaje</p>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.services-section {
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.service-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.service-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: grayscale(30%);
  transition: filter 0.3s;
}

.service-card:hover .service-icon {
  filter: grayscale(0%);
}

.service-card h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.service-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>

