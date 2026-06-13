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
      <transition-group name="slide" tag="div" class="slides">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          v-show="index === currentSlide"
          class="slide"
          :style="slide.videoUrl ? {} : { backgroundImage: `url(${slide.imageUrl})` }"
          :aria-hidden="index !== currentSlide"
        >
          <video
            v-if="slide.videoUrl"
            :ref="(el) => setVideoRef(el, index)"
            :src="slide.videoUrl"
            class="slide-video"
            muted
            loop
            playsinline
            autoplay
            aria-hidden="true"
          />
          <div class="slide-content">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.subtitle }}</p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Controles de navegación -->
    <button class="slider-arrow slider-arrow--prev" @click="prevSlide" aria-label="Diapositiva anterior">
      &#8249;
    </button>
    <button class="slider-arrow slider-arrow--next" @click="nextSlide" aria-label="Diapositiva siguiente">
      &#8250;
    </button>

    <!-- Indicadores de posición y botón pausa -->
    <div class="slider-footer" role="group" aria-label="Controles del carrusel">
      <button
        class="slider-pause"
        @click="togglePause"
        :aria-label="isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'"
        :title="isPaused ? 'Reanudar' : 'Pausar'"
      >
        <span v-if="isPaused" aria-hidden="true">▶</span>
        <span v-else aria-hidden="true">⏸</span>
      </button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import type { Slide } from '../types/blog'

const props = defineProps<{
  slides: Slide[]
}>()

const currentSlide = ref(0)
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
const isPaused = ref(false)
let intervalId: number | null = null

const setVideoRef = (el: unknown, index: number) => {
  if (el instanceof HTMLVideoElement) {
    videoRefs.value[index] = el
  }
}

const playCurrentVideo = () => {
  videoRefs.value.forEach((v: HTMLVideoElement | null, i: number) => {
    if (v) {
      if (i === currentSlide.value) {
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    }
  })
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length
  playCurrentVideo()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? props.slides.length - 1 : currentSlide.value - 1
  playCurrentVideo()
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  playCurrentVideo()
}

const startAutoplay = () => {
  if (isPaused.value) return
  stopAutoplay()
  intervalId = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopAutoplay()
  } else {
    startAutoplay()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') { prevSlide(); e.preventDefault() }
  if (e.key === 'ArrowRight') { nextSlide(); e.preventDefault() }
}

onMounted(() => {
  startAutoplay()
  playCurrentVideo()
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

.slides {
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

.slide-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.6;
}

.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 200, 150, 0.25), rgba(200, 150, 100, 0.35));
  mix-blend-mode: overlay;
  z-index: 1;
}

.slide:has(.slide-video)::before {
  background: rgba(0, 0, 0, 0.5);
  mix-blend-mode: normal;
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

/* Flechas de navegación */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background: rgba(0,0,0,0.35);
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  backdrop-filter: blur(4px);
}

.slider-arrow:hover,
.slider-arrow:focus-visible {
  background: rgba(0,0,0,0.65);
  outline: 2px solid white;
  outline-offset: 2px;
}

.slider-arrow--prev { left: 1.25rem; }
.slider-arrow--next { right: 1.25rem; }

/* Footer: pausa + dots */
.slider-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 3;
}

.slider-pause {
  background: rgba(0,0,0,0.4);
  color: white;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  backdrop-filter: blur(4px);
  flex-shrink: 0;
}

.slider-pause:hover,
.slider-pause:focus-visible {
  background: rgba(0,0,0,0.65);
  outline: 2px solid white;
  outline-offset: 2px;
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
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
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

  .slider-arrow {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.4rem;
  }

  .slider-arrow--prev { left: 0.75rem; }
  .slider-arrow--next { right: 0.75rem; }
}
</style>
