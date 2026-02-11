<template>
  <div class="hero-slider">
    <div class="slider-container">
      <transition-group name="slide" tag="div" class="slides">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          v-show="index === currentSlide"
          class="slide"
          :style="slide.videoUrl ? {} : { backgroundImage: `url(${slide.imageUrl})` }"
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
          />
          <div class="slide-content">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.subtitle }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Slide } from '../types/blog'

const props = defineProps<{
  slides: Slide[]
}>()

const currentSlide = ref(0)
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
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
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? props.slides.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  intervalId = window.setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

watch(currentSlide, playCurrentVideo)

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255, 200, 150, 0.25), rgba(200, 150, 100, 0.35));
  mix-blend-mode: overlay;
  z-index: 1;
}

/* Overlay más oscuro cuando hay video */
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

.slider-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.slider-controls button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: background 0.3s;
}

.slider-controls button.active {
  background: white;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}

.slide-enter-from {
  opacity: 0;
}

.slide-leave-to {
  opacity: 0;
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
}
</style>

