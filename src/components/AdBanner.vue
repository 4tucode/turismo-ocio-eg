<template>
  <div v-if="banner" class="ad-banner">
    <a v-if="banner.link" :href="banner.link" target="_blank" rel="noopener noreferrer">
      <img :src="banner.imageUrl" :alt="banner.alt" />
    </a>
    <img v-else :src="banner.imageUrl" :alt="banner.alt" />
  </div>
</template>

<script setup lang="ts">
import type { Banner } from '../types/blog'

defineProps<{
  banner?: Banner | null
}>()
</script>

<style scoped>
.ad-banner {
  width: 100%;
  max-height: 120px;
  overflow: hidden;

  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ad-banner img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.ad-banner a {
  display: block;
  transition: opacity 0.3s;
}

.ad-banner a:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .ad-banner {
    max-height: 80px;
  }
  
  .ad-banner img {
    height: 80px;
  }
}
</style>

