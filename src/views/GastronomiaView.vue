<template>
  <div class="gastronomia">
    <div class="hero-section">
      <h1 class="hero-title">Gastronomía</h1>
      <p class="hero-subtitle">Descubre los sabores y tradiciones culinarias de Guinea Ecuatorial</p>
    </div>

    <section class="articles-section">
      <div class="articles-grid">
        <RouterLink
          v-for="article in blogStore.getCulturaArticlesByCategory('gastronomia')"
          :key="article.id"
          :to="`/gastronomia/${article.slug}`"
          class="article-card"
        >
          <div v-if="article.imageUrl" class="article-image">
            <img :src="article.imageUrl" :alt="article.title" />
          </div>
          <div class="article-content">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div v-if="article.location" class="article-location">
              📍 {{ article.location }}
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()
</script>

<style scoped>
.gastronomia {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto;
}

.articles-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.article-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #e0e0e0;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: bold;
  line-height: 1.3;
}

.article-excerpt {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.article-location {
  color: #f5576c;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: auto;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .articles-section {
    padding: 2rem 1rem;
  }
}
</style>
