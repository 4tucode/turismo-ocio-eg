<template>
  <section
    class="hero-slider"
    role="region"
    aria-label="Carrusel de portada"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @focusin="stopAutoplay"
    @focusout="startAutoplay"
    @keydown="handleKeydown"
  >
    <div class="slider-container" aria-live="polite" aria-atomic="true">
      <Transition name="fade" mode="out-in">
        <div
          :key="currentSlideData.id"
          class="slide"
          :style="{ backgroundImage: `url(${currentSlideData.imageUrl})` }"
        >
          <div class="slide-content">
            <h1>{{ currentSlideData.title }}</h1>
            <p>{{ currentSlideData.subtitle }}</p>
            <RouterLink :to="currentSlideData.link" class="slide-cta">
              Explorar destinos
            </RouterLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Controles de navegación -->
    <button class="slider-arrow slider-arrow--prev" @click="prevSlide" aria-label="Diapositiva anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button class="slider-arrow slider-arrow--next" @click="nextSlide" aria-label="Diapositiva siguiente">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <!-- Indicadores de posición -->
    <div class="slider-footer" role="group" aria-label="Indicadores de diapositiva">
      <div class="slider-dots" role="tablist" aria-label="Diapositivas">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          role="tab"
          class="slider-dot"
          :class="{ active: index === currentSlide }"
          :aria-selected="index === currentSlide"
          :aria-label="`Ir a diapositiva ${index + 1}: ${slide.title}`"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Slide } from '../types/blog'

const props = defineProps<{
  slides: Slide[]
}>()

const currentSlide = ref(0)
const currentSlideData = computed(() => props.slides[currentSlide.value])
let intervalId: number | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? props.slides.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  stopAutoplay()
  intervalId = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') { prevSlide(); e.preventDefault() }
  if (e.key === 'ArrowRight') { nextSlide(); e.preventDefault() }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.slider-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: sepia(20%) brightness(1.05) saturate(1.15);
}

.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 200, 150, 0.25), rgba(200, 150, 100, 0.35));
  mix-blend-mode: overlay;
  z-index: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 2rem;
  max-width: 800px;
}

.slide-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.slide-content p {
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.slide-cta {
  display: inline-block;
  margin-top: 1.75rem;
  padding: 0.85rem 2rem;
  background: #f5a623;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.slide-cta:hover {
  background: #ffb949;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}

/* Flechas de navegación */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background: rgba(0,0,0,0.4);
  color: white;
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  min-width: 3rem;
  min-height: 3rem;
  padding: 0;
  box-sizing: border-box;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  backdrop-filter: blur(4px);
  flex-shrink: 0;
  -webkit-appearance: none;
  appearance: none;
}

.slider-arrow:hover { background: rgba(0,0,0,0.65); }
.slider-arrow:focus { outline: none; box-shadow: none; }
.slider-arrow:focus-visible { outline: none; box-shadow: none; }

.slider-arrow--prev { left: 1.25rem; }
.slider-arrow--next { right: 1.25rem; }

.slider-arrow svg {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  flex-shrink: 0;
}

/* Footer: dots */
.slider-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 3;
}

.slider-dots {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.slider-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.85);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, transform 0.2s;
}

.slider-dot.active {
  background: white;
  transform: scale(1.25);
}

.slider-dot:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
  .slider-arrow,
  .slider-dot {
    transition: none;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: 400px;
  }

  .slide-content h1 {
    font-size: 2rem;
  }

  .slide-content p {
    font-size: 1.125rem;
  }

  .slide-cta {
    margin-top: 1.25rem;
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
  }

  .slider-arrow {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.4rem;
  }

  .slider-arrow--prev { left: 0.75rem; }
  .slider-arrow--next { right: 0.75rem; }
}
</style>
