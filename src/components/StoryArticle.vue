<template>
  <article class="pt-10 pb-20">
    <header class="mx-auto max-w-[52rem] px-(--gutter) text-center">
      <nav class="mb-8 text-kicker font-medium uppercase tracking-kicker text-ink-muted" aria-label="Migas de pan">
        <RouterLink to="/" class="text-ink-muted no-underline hover:text-accent">Inicio</RouterLink>
        <template v-if="sectionPath !== '/'">
          <span class="mx-2" aria-hidden="true">/</span>
          <RouterLink :to="sectionPath" class="text-accent no-underline hover:text-accent-hover">
            {{ categoryLabel(article.category) }}
          </RouterLink>
        </template>
      </nav>

      <p class="mb-4 text-kicker font-medium uppercase tracking-kicker text-accent">
        {{ categoryLabel(article.category) }}
      </p>
      <h1 class="text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02]">{{ article.title }}</h1>

      <p
        class="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-1 border-y border-rule py-3 text-kicker font-medium uppercase tracking-kicker text-ink-muted"
      >
        <time :datetime="article.date">{{ formatLongDate(article.date) }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ readingMinutes(article.content) }} min de lectura</span>
        <template v-if="article.location">
          <span aria-hidden="true">·</span>
          <span>{{ article.location }}</span>
        </template>
      </p>
    </header>

    <figure v-if="article.imageUrl" class="mx-auto mt-10 max-w-page px-(--gutter)">
      <img :src="article.imageUrl" :alt="article.title" class="block max-h-[75vh] w-full object-cover" />
      <figcaption
        v-if="article.imageCredit"
        class="mt-2 border-b border-rule pb-2 text-right font-sans text-xs text-ink-muted"
      >
        Foto:
        <a
          v-if="article.imageCreditUrl"
          :href="article.imageCreditUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-ink-muted underline decoration-rule underline-offset-2 hover:text-accent"
        >{{ article.imageCredit }}</a>
        <template v-else>{{ article.imageCredit }}</template>
      </figcaption>
    </figure>

    <div class="story-body mx-auto mt-12 max-w-[42rem] px-(--gutter)" v-html="article.content"></div>

    <footer class="mx-auto mt-16 max-w-[42rem] px-(--gutter)">
      <RouterLink
        :to="sectionPath"
        class="inline-flex items-center gap-2 border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker text-ink no-underline hover:border-accent hover:text-accent"
      >
        <span aria-hidden="true">←</span>
        {{ sectionPath === '/' ? 'Volver a la portada' : `Volver a ${categoryLabel(article.category)}` }}
      </RouterLink>
    </footer>

    <section
      v-if="related.length > 0"
      class="mx-auto mt-20 max-w-page px-(--gutter)"
      aria-labelledby="relacionados"
    >
      <h2
        id="relacionados"
        class="mb-8 border-b border-ink pb-4 text-kicker font-sans font-medium uppercase tracking-kicker text-ink"
      >
        Más en {{ categoryLabel(article.category) }}
      </h2>
      <div class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <StoryCard v-for="item in related" :key="item.id" :article="item" :to="linkTo(item)" />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '../services/articleService'
import { subscribeArticlesByCategory } from '../services/articleService'
import { categoryLabel, categoryPath, formatLongDate, readingMinutes } from '../utils/editorial'
import StoryCard from './StoryCard.vue'

const RELATED_COUNT = 3

const props = defineProps<{
  article: Article
}>()

const sectionPath = computed(() => categoryPath(props.article.category))

const linkTo = (item: Article) => (categoryPath(item.category) === '/' ? `/post/${item.slug}` : `/${item.category}/${item.slug}`)

const sameCategory = ref<Article[]>([])
const related = computed(() => sameCategory.value.filter((item) => item.id !== props.article.id).slice(0, RELATED_COUNT))

let unsubscribe: (() => void) | null = null

watch(
  () => props.article.category,
  (category) => {
    unsubscribe?.()
    unsubscribe = subscribeArticlesByCategory(category, (data) => {
      sameCategory.value = data
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<style scoped>
/* Cuerpo del artículo: HTML del editor TipTap */
.story-body {
  font-family: var(--font-body);
  font-size: 1.1875rem;
  line-height: 1.75;
  color: var(--color-ink);
}

.story-body :deep(p) {
  margin-bottom: 1.5em;
}

/* Entradilla: primer párrafo escrito entero en negrita */
.story-body > :deep(p:first-child:has(> strong:only-child)) {
  margin-bottom: 1.75em;
  font-family: var(--font-serif);
  font-size: 1.35em;
  line-height: 1.45;
}

.story-body > :deep(p:first-child > strong:only-child) {
  font-weight: 400;
}

/* Capitular en el primer párrafo de texto, después de la entradilla si la hay */
.story-body > :deep(p:first-child:has(> strong:only-child) + p::first-letter),
.story-body > :deep(p:first-child:not(:has(> strong:only-child))::first-letter) {
  float: left;
  margin: 0.08em 0.12em 0 0;
  font-family: var(--font-display);
  font-size: 4.6em;
  line-height: 0.8;
  color: var(--color-accent);
}

.story-body :deep(h2),
.story-body :deep(h3),
.story-body :deep(h4) {
  margin: 2.4em 0 0.7em;
  line-height: 1.15;
}

.story-body :deep(h2) {
  font-size: 2rem;
}

.story-body :deep(h3) {
  font-size: 1.5rem;
}

.story-body :deep(h4) {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: var(--tracking-kicker);
  text-transform: uppercase;
  color: var(--color-accent);
}

.story-body :deep(ul),
.story-body :deep(ol) {
  margin: 0 0 1.5em 1.25em;
}

.story-body :deep(ul) {
  list-style: square;
}

.story-body :deep(ol) {
  list-style: decimal;
}

.story-body :deep(li) {
  margin-bottom: 0.75em;
  padding-left: 0.25em;
}

.story-body :deep(li p) {
  margin-bottom: 0;
}

.story-body :deep(li::marker) {
  color: var(--color-accent);
}

.story-body :deep(blockquote) {
  margin: 2.25em 0;
  padding: 0.25em 0 0.25em 1.25em;
  border-left: 3px solid var(--color-accent);
  font-family: var(--font-body);
  font-size: 1.45rem;
  font-style: italic;
  line-height: 1.4;
}

.story-body :deep(blockquote p) {
  margin: 0;
}

.story-body :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  margin: 2.5em 0;
}

.story-body :deep(a) {
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.story-body :deep(a:hover) {
  color: var(--color-accent);
}

.story-body :deep(strong) {
  font-weight: 600;
}

.story-body :deep(hr) {
  margin: 3em auto;
  width: 4rem;
  border: 0;
  border-top: 1px solid var(--color-ink);
}

.story-body :deep(pre) {
  margin-bottom: 1.5em;
  padding: 1em;
  overflow-x: auto;
  background: var(--color-paper-alt);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .story-body {
    font-size: 1.0625rem;
  }

  .story-body :deep(blockquote) {
    font-size: 1.25rem;
  }
}
</style>
