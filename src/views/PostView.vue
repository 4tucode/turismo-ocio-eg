<template>
  <div>
    <div v-if="loading" class="mx-auto max-w-[52rem] px-(--gutter) pt-16 pb-20" aria-busy="true" aria-label="Cargando artículo">
      <div class="mx-auto h-3 w-24 animate-pulse bg-paper-alt" aria-hidden="true"></div>
      <div class="mx-auto mt-6 h-14 w-11/12 animate-pulse bg-paper-alt" aria-hidden="true"></div>
      <div class="mx-auto mt-3 h-14 w-2/3 animate-pulse bg-paper-alt" aria-hidden="true"></div>
      <div class="mt-12 aspect-[16/9] animate-pulse bg-paper-alt" aria-hidden="true"></div>
    </div>

    <StoryArticle v-else-if="post" :key="post.id" :article="post" />

    <div v-else class="mx-auto max-w-xl px-(--gutter) py-24 text-center">
      <p class="text-kicker font-medium uppercase tracking-kicker text-accent">Error 404</p>
      <h1 class="mt-4 text-h2 leading-tight">No encontramos este artículo</h1>
      <p class="mt-4 font-serif text-lead text-ink-soft">Puede que se haya retirado o que el enlace no sea correcto.</p>
      <RouterLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker text-ink no-underline hover:border-accent hover:text-accent"
      >
        <span aria-hidden="true">←</span> Volver a la portada
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { subscribeArticleBySlug, type Article } from '../services/articleService'
import StoryArticle from '../components/StoryArticle.vue'

const route = useRoute()
const post = ref<Article | null>(null)
const loading = ref(true)
let unsubscribe: (() => void) | null = null

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug !== 'string') return
    unsubscribe?.()
    loading.value = true
    unsubscribe = subscribeArticleBySlug(
      slug,
      (article) => {
        post.value = article
        loading.value = false
      },
      () => {
        loading.value = false
      }
    )
  },
  { immediate: true }
)

onUnmounted(() => {
  unsubscribe?.()
})
</script>
