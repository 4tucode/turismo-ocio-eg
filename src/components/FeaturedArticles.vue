<template>
  <div>
    <header class="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-ink pb-5">
      <div>
        <p class="mb-3 text-kicker font-medium uppercase tracking-kicker text-accent">Actualidad</p>
        <h2 class="text-h2 leading-none">Historias para entender el país</h2>
      </div>

      <nav v-if="totalPages > 1" class="flex items-center gap-4" aria-label="Paginación de artículos">
        <span class="text-kicker font-medium uppercase tracking-kicker text-ink-muted">
          Página {{ page + 1 }} de {{ totalPages }}
        </span>
        <button
          v-for="control in controls"
          :key="control.label"
          type="button"
          class="flex h-10 w-10 items-center justify-center border border-ink bg-transparent p-0 text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-default disabled:border-rule disabled:text-ink-muted disabled:hover:bg-transparent"
          :disabled="control.disabled"
          :aria-label="control.label"
          @click="goTo(page + control.step)"
        >
          <span aria-hidden="true">{{ control.icon }}</span>
        </button>
      </nav>
    </header>

    <div v-if="loading" class="grid gap-8 md:grid-cols-[4fr_3fr_3fr]" aria-busy="true" aria-label="Cargando artículos">
      <div v-for="n in 3" :key="n" aria-hidden="true">
        <div class="aspect-[4/3] animate-pulse bg-paper-alt"></div>
        <div class="mt-4 h-3 w-1/4 animate-pulse bg-paper-alt"></div>
        <div class="mt-3 h-6 w-5/6 animate-pulse bg-paper-alt"></div>
        <div class="mt-2 h-6 w-2/3 animate-pulse bg-paper-alt"></div>
      </div>
    </div>

    <template v-else>
      <div class="grid gap-x-8 gap-y-10 md:grid-cols-[4fr_3fr_3fr]">
        <StoryCard v-for="article in featured" :key="article.id" :article="article" :to="`/post/${article.slug}`" />
      </div>

      <ul v-if="more.length > 0" class="mt-12 grid list-none gap-x-8 border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="article in more" :key="article.id" class="border-b border-rule py-5 lg:border-b-0">
          <StoryCard :article="article" :to="`/post/${article.slug}`" variant="compact" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Article } from '../services/articleService'
import StoryCard from './StoryCard.vue'

const FEATURED_PER_PAGE = 3
const MORE_PER_PAGE = 4
const PER_PAGE = FEATURED_PER_PAGE + MORE_PER_PAGE

const props = defineProps<{
  articles: Article[]
  loading: boolean
}>()

const page = ref(0)
const totalPages = computed(() => Math.ceil(props.articles.length / PER_PAGE))

const pageArticles = computed(() => props.articles.slice(page.value * PER_PAGE, (page.value + 1) * PER_PAGE))
const featured = computed(() => pageArticles.value.slice(0, FEATURED_PER_PAGE))
const more = computed(() => pageArticles.value.slice(FEATURED_PER_PAGE))

const controls = computed(() => [
  { label: 'Página anterior', icon: '←', step: -1, disabled: page.value === 0 },
  { label: 'Página siguiente', icon: '→', step: 1, disabled: page.value >= totalPages.value - 1 }
])

const goTo = (target: number) => {
  page.value = Math.min(Math.max(target, 0), totalPages.value - 1)
}

// Si se borran artículos y la página actual deja de existir
watch(totalPages, (total) => {
  if (page.value > 0 && page.value >= total) page.value = total - 1
})
</script>
