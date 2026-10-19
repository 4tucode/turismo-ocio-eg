<template>
  <div class="mx-auto max-w-page px-(--gutter) pt-10 pb-20">
    <header class="[border-bottom:4px_double_var(--color-ink)] pb-8">
      <nav class="mb-6 text-kicker font-medium uppercase tracking-kicker text-ink-muted" aria-label="Migas de pan">
        <RouterLink to="/" class="text-ink-muted no-underline hover:text-accent">Inicio</RouterLink>
        <span class="mx-2" aria-hidden="true">/</span>
        <span class="text-accent" aria-current="page">{{ title }}</span>
      </nav>
      <div class="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
        <h1 class="text-h1 leading-[0.95]">{{ title }}</h1>
        <p class="max-w-md font-serif text-lead leading-snug text-ink-soft">{{ description }}</p>
      </div>
    </header>

    <p class="border-b border-rule py-3 text-kicker font-medium uppercase tracking-kicker text-ink-muted">
      <template v-if="loading">Cargando artículos…</template>
      <template v-else>{{ articles.length }} {{ articles.length === 1 ? 'artículo' : 'artículos' }}</template>
    </p>

    <!-- Carga -->
    <div v-if="loading" class="mt-10 grid gap-10 md:grid-cols-[7fr_5fr]" aria-busy="true" aria-label="Cargando artículos">
      <div aria-hidden="true">
        <div class="h-3 w-1/5 animate-pulse bg-paper-alt"></div>
        <div class="mt-4 h-12 w-11/12 animate-pulse bg-paper-alt"></div>
        <div class="mt-3 h-12 w-2/3 animate-pulse bg-paper-alt"></div>
        <div class="mt-6 h-4 w-full animate-pulse bg-paper-alt"></div>
        <div class="mt-2 h-4 w-4/5 animate-pulse bg-paper-alt"></div>
      </div>
      <div class="aspect-[4/3] animate-pulse bg-paper-alt" aria-hidden="true"></div>
    </div>

    <!-- Sin artículos -->
    <div v-else-if="articles.length === 0" class="py-20 text-center">
      <p class="text-kicker font-medium uppercase tracking-kicker text-accent">Próximamente</p>
      <p class="mx-auto mt-4 max-w-lg font-serif text-2xl leading-snug">
        Estamos preparando los primeros artículos de esta sección. Vuelve pronto.
      </p>
      <RouterLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker text-ink no-underline hover:border-accent hover:text-accent"
      >
        <span aria-hidden="true">←</span> Volver a la portada
      </RouterLink>
    </div>

    <template v-else>
      <!-- Abridora -->
      <div class="border-b border-rule py-10">
        <StoryCard :article="lead" :to="linkTo(lead)" variant="lead" />
      </div>

      <!-- Segunda línea -->
      <div v-if="secondary.length > 0" class="grid gap-x-12 border-b border-rule sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(article, index) in secondary"
          :key="article.id"
          class="relative border-b border-rule py-10 before:absolute before:inset-y-10 before:-left-6 before:hidden before:w-px before:bg-rule last:border-b-0 sm:border-b-0"
          :class="{ 'sm:max-lg:before:block': index % 2 === 1, 'lg:before:block': index > 0 }"
        >
          <StoryCard :article="article" :to="linkTo(article)" />
        </div>
      </div>

      <!-- Resto + otras secciones -->
      <div class="grid gap-x-16 gap-y-12 pt-10 lg:grid-cols-[8fr_4fr]">
        <section v-if="rest.length > 0" aria-labelledby="mas-en-seccion">
          <h2 id="mas-en-seccion" class="mb-2 text-kicker font-sans font-medium uppercase tracking-kicker text-ink">
            Más en {{ title }}
          </h2>
          <ul class="list-none border-t border-ink">
            <li v-for="article in rest" :key="article.id" class="border-b border-rule py-6">
              <StoryCard :article="article" :to="linkTo(article)" variant="row" />
            </li>
          </ul>
        </section>

        <aside class="lg:col-start-2" aria-labelledby="otras-secciones">
          <h2 id="otras-secciones" class="mb-2 text-kicker font-sans font-medium uppercase tracking-kicker text-ink">
            Otras secciones
          </h2>
          <ul class="list-none border-t border-ink">
            <li v-for="section in otherSections" :key="section.to" class="border-b border-rule">
              <RouterLink
                :to="section.to"
                class="group flex items-baseline justify-between gap-4 py-4 text-ink no-underline"
              >
                <span class="font-display text-2xl transition-colors group-hover:text-accent">{{ section.label }}</span>
                <span class="text-ink-muted transition-colors group-hover:text-accent" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '../services/articleService'
import { subscribeArticlesByCategory } from '../services/articleService'
import StoryCard from './StoryCard.vue'

const SECONDARY_COUNT = 3

const SECTIONS = [
  { category: 'cultura', label: 'Cultura e Historia', to: '/cultura' },
  { category: 'naturaleza', label: 'Naturaleza y Aventura', to: '/naturaleza' },
  { category: 'gastronomia', label: 'Gastronomía', to: '/gastronomia' },
  { category: 'ocio', label: 'Ocio y Entretenimiento', to: '/ocio' }
]

const props = defineProps<{
  category: 'cultura' | 'naturaleza' | 'gastronomia' | 'ocio'
  title: string
  description: string
}>()

const articles = ref<Article[]>([])
const loading = ref(true)
let unsubscribe: (() => void) | null = null

// La plantilla solo usa `lead` cuando hay artículos
const lead = computed(() => articles.value[0] as Article)
const secondary = computed(() => articles.value.slice(1, 1 + SECONDARY_COUNT))
const rest = computed(() => articles.value.slice(1 + SECONDARY_COUNT))

const otherSections = computed(() => SECTIONS.filter((section) => section.category !== props.category))

const linkTo = (article: Article) => `/${props.category}/${article.slug}`

onMounted(() => {
  unsubscribe = subscribeArticlesByCategory(props.category, (data) => {
    articles.value = data
    loading.value = false
  })
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>
