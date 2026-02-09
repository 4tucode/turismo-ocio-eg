<template>
  <div class="province-view">
    <!-- Hero Section -->
    <section class="hero-section" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${provinceInfo?.heroImage || ''})` }">
      <div class="hero-content">
        <h1 class="hero-title">{{ provinceInfo?.name }}</h1>
        <p class="hero-subtitle">{{ provinceInfo?.capital }}</p>
        <p class="hero-description">{{ provinceInfo?.description }}</p>
      </div>
    </section>

    <!-- Info Cards Section -->
    <section v-if="provinceInfo?.infoCards && provinceInfo.infoCards.length > 0" class="info-cards-section">
      <h2 class="section-title">Información General</h2>
      <div class="info-cards-grid">
        <div 
          v-for="card in provinceInfo.infoCards" 
          :key="card.id"
          class="info-card"
        >
          <div class="card-icon">{{ card.icon }}</div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-content">{{ card.content }}</p>
          <div 
            v-if="card.imageUrl" 
            class="card-image"
            :style="{ backgroundImage: `url(${card.imageUrl})` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Highlights Section -->
    <section v-if="provinceInfo?.highlights && provinceInfo.highlights.length > 0" class="highlights-section">
      <h2 class="section-title">Lugares Destacados</h2>
      <div class="highlights-grid">
        <div 
          v-for="highlight in provinceInfo.highlights" 
          :key="highlight.id"
          class="highlight-card"
        >
          <div 
            class="highlight-image"
            :style="{ backgroundImage: `url(${highlight.imageUrl})` }"
          ></div>
          <div class="highlight-content">
            <h3 class="highlight-title">{{ highlight.title }}</h3>
            <p class="highlight-description">{{ highlight.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Facts Section -->
    <section v-if="provinceInfo?.facts && provinceInfo.facts.length > 0" class="facts-section">
      <h2 class="section-title">Datos Curiosos</h2>
      <div class="facts-grid">
        <div 
          v-for="(fact, index) in provinceInfo.facts" 
          :key="index"
          class="fact-card"
        >
          <div class="fact-icon">✨</div>
          <p class="fact-text">{{ fact }}</p>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section v-if="provinceInfo?.gallery && provinceInfo.gallery.length > 0" class="gallery-section">
      <h2 class="section-title">Galería</h2>
      <div class="gallery-grid">
        <div 
          v-for="(imageUrl, index) in provinceInfo.gallery" 
          :key="index"
          class="gallery-item"
          @click="openGallery(index)"
        >
          <img :src="imageUrl" :alt="`${provinceInfo.name} - Imagen ${index + 1}`" />
          <div class="gallery-overlay">
            <span class="gallery-icon">🔍</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Modal -->
    <div v-if="showGallery" class="gallery-modal" @click="closeGallery">
      <button class="modal-close" @click="closeGallery">×</button>
      <button class="modal-prev" @click="prevGalleryImage">❮</button>
      <img 
        :src="provinceInfo?.gallery[galleryIndex]" 
        :alt="`${provinceInfo?.name} - Galería`"
        @click.stop
      />
      <button class="modal-next" @click="nextGalleryImage">❯</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const currentSlide = ref(0)
const showGallery = ref(false)
const galleryIndex = ref(0)
let slideInterval: number | null = null

const provinceInfo = computed(() => {
  const slug = route.params.slug as string
  return blogStore.getProvinceInfoBySlug(slug)
})

const openGallery = (index: number) => {
  galleryIndex.value = index
  showGallery.value = true
  document.body.style.overflow = 'hidden'
}

const closeGallery = () => {
  showGallery.value = false
  document.body.style.overflow = ''
}

const prevGalleryImage = () => {
  if (provinceInfo.value && galleryIndex.value > 0) {
    galleryIndex.value--
  } else if (provinceInfo.value) {
    galleryIndex.value = provinceInfo.value.gallery.length - 1
  }
}

const nextGalleryImage = () => {
  if (provinceInfo.value && galleryIndex.value < provinceInfo.value.gallery.length - 1) {
    galleryIndex.value++
  } else if (provinceInfo.value) {
    galleryIndex.value = 0
  }
}

onMounted(() => {
  // Keyboard navigation for gallery
  const handleKeyDown = (e: KeyboardEvent) => {
    if (showGallery.value) {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') prevGalleryImage()
      if (e.key === 'ArrowRight') nextGalleryImage()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.province-view {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  width: 100%;
  height: 70vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 900px;
  z-index: 1;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
  animation: fadeInUp 0.8s ease;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  animation: fadeInUp 0.8s ease 0.2s backwards;
}

.hero-description {
  font-size: 1.3rem;
  line-height: 1.8;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  animation: fadeInUp 0.8s ease 0.4s backwards;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
}

/* Info Cards Section */
.info-cards-section {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.info-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.card-content {
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 1rem;
}

.card-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-top: 1rem;
}

/* Highlights Section */
.highlights-section {
  padding: 4rem 2rem;
  background: white;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.highlight-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.highlight-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.highlight-image {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
}

.highlight-content {
  padding: 2rem;
}

.highlight-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.highlight-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
}

/* Facts Section */
.facts-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.fact-card {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s, background 0.3s;
  border: 2px solid rgba(255,255,255,0.3);
}

.fact-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.3);
}

.fact-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.fact-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

/* Gallery Section */
.gallery-section {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-icon {
  font-size: 2.5rem;
  color: white;
}

/* Gallery Modal */
.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  font-weight: bold;
  z-index: 1001;
  transition: transform 0.3s;
}

.modal-close:hover {
  transform: scale(1.1);
}

.modal-prev,
.modal-next {
  position: absolute;
  background: rgba(255,255,255,0.2);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  z-index: 1001;
  transition: background 0.3s;
}

.modal-prev:hover,
.modal-next:hover {
  background: rgba(255,255,255,0.3);
}

.modal-prev {
  left: 2rem;
}

.modal-next {
  right: 2rem;
}

.gallery-modal img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 10px;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .info-cards-grid,
  .highlights-grid,
  .facts-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .modal-prev,
  .modal-next {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .modal-prev {
    left: 1rem;
  }

  .modal-next {
    right: 1rem;
  }
}
</style>

