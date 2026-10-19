<template>
  <div>
    <header class="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-ink pb-5">
      <div>
        <p class="mb-3 flex items-center gap-3 text-kicker font-medium uppercase tracking-kicker text-ink">
          <span class="block h-px w-10 bg-accent" aria-hidden="true"></span>
          Secciones
        </p>
        <h2 class="text-h2 leading-none">Cuatro maneras de recorrer el país</h2>
      </div>
      <p class="max-w-sm font-serif text-lead leading-snug text-ink-soft">
        Rutas, sabores, tradiciones y planes para cada tipo de viajero.
      </p>
    </header>

    <div class="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="(section, index) in sections"
        :key="section.key"
        class="relative flex flex-col border-b border-rule py-8 before:absolute before:inset-y-0 before:-left-6 before:hidden before:w-px before:bg-rule lg:border-b-0 lg:py-0"
        :class="{ 'sm:before:block': index % 2 === 1, 'lg:before:block': index > 0 }"
      >
        <RouterLink :to="section.to" class="group block text-ink no-underline">
          <p class="mb-3 flex items-baseline justify-between text-kicker font-medium uppercase tracking-kicker">
            <span class="text-accent">{{ section.kicker }}</span>
            <span class="text-ink-muted" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          </p>
          <div class="aspect-[4/3] overflow-hidden bg-paper-alt">
            <img
              :src="section.image"
              alt=""
              loading="lazy"
              class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 class="mt-4 text-h3 leading-tight transition-colors group-hover:text-accent">
            {{ section.title }}
          </h3>
        </RouterLink>

        <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ section.description }}</p>

        <ul v-if="section.headlines.length > 0" class="mt-5 list-none border-t border-rule">
          <li v-for="article in section.headlines" :key="article.id" class="border-b border-rule">
            <RouterLink
              :to="`${section.to}/${article.slug}`"
              class="block py-3 font-serif leading-snug text-ink no-underline transition-colors hover:text-accent"
            >
              {{ article.title }}
            </RouterLink>
          </li>
        </ul>

        <RouterLink
          :to="section.to"
          class="mt-5 inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker text-ink no-underline transition-colors hover:border-accent hover:text-accent lg:mt-auto lg:pt-5"
        >
          Ver {{ section.short }}
          <span aria-hidden="true">→</span>
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '../services/articleService'
import culturaImage from '../assets/cultura.webp'
import naturalezaImage from '../assets/naturaleza.jpg'
import gastronomiaImage from '../assets/comidaguineana.jpg'
import ocioImage from '../assets/paseo.jpg'

const HEADLINES_PER_SECTION = 3

const props = defineProps<{
  articles: Article[]
}>()

const baseSections = [
  {
    key: 'cultura',
    to: '/cultura',
    kicker: 'Cultura',
    short: 'cultura',
    title: 'Cultura e Historia',
    description: 'Pueblos, lenguas y memoria: las tradiciones que explican el país.',
    image: culturaImage
  },
  {
    key: 'naturaleza',
    to: '/naturaleza',
    kicker: 'Naturaleza',
    short: 'naturaleza',
    title: 'Naturaleza y Aventura',
    description: 'Selva, volcanes y playas vírgenes para recorrer sin prisa.',
    image: naturalezaImage
  },
  {
    key: 'gastronomia',
    to: '/gastronomia',
    kicker: 'Gastronomía',
    short: 'gastronomía',
    title: 'Gastronomía',
    description: 'Los platos, los mercados y las cocinas donde se come de verdad.',
    image: gastronomiaImage
  },
  {
    key: 'ocio',
    to: '/ocio',
    kicker: 'Ocio',
    short: 'ocio',
    title: 'Ocio y Entretenimiento',
    description: 'Planes, paseos y vida nocturna para después de la ruta.',
    image: ocioImage
  }
]

const sections = computed(() =>
  baseSections.map((section) => {
    const sectionArticles = props.articles.filter((article) => article.category === section.key)
    return {
      ...section,
      image: sectionArticles.find((article) => article.imageUrl)?.imageUrl ?? section.image,
      headlines: sectionArticles.slice(0, HEADLINES_PER_SECTION)
    }
  })
)
</script>
