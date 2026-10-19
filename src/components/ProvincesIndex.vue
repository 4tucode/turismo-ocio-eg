<template>
  <div>
    <header class="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-ink pb-5">
      <div>
        <p class="mb-3 flex items-center gap-3 text-kicker font-medium uppercase tracking-kicker text-ink">
          <span class="block h-px w-10 bg-accent" aria-hidden="true"></span>
          Provincias
        </p>
        <h2 class="text-h2 leading-none">Guía del país, provincia a provincia</h2>
      </div>
      <p class="max-w-sm font-serif text-lead leading-snug text-ink-soft">
        De las islas del golfo a la selva continental: paisajes, gente y lugares imprescindibles.
      </p>
    </header>

    <div class="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink
        v-for="(province, index) in entries"
        :key="province.id"
        :to="`/provincia/${province.slug}`"
        class="group relative flex flex-col border-b border-rule py-8 text-ink no-underline before:absolute before:inset-y-8 before:-left-6 before:hidden before:w-px before:bg-rule"
        :class="{ 'sm:max-lg:before:block': index % 2 === 1, 'lg:before:block': index % 4 !== 0 }"
      >
        <p class="mb-3 flex items-baseline justify-between text-kicker font-medium uppercase tracking-kicker">
          <span class="text-accent">{{ province.region }}</span>
          <span class="text-ink-muted" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        </p>

        <div class="relative aspect-[3/2] overflow-hidden bg-paper-alt">
          <img
            v-if="province.image && !failedImages.has(province.id)"
            :src="province.image"
            alt=""
            loading="lazy"
            class="block h-full w-full transition-transform duration-500 group-hover:scale-105"
            :class="province.isMap ? 'object-contain p-3 mix-blend-multiply' : 'object-cover'"
            @error="failedImages.add(province.id)"
          />
          <span
            v-else
            class="absolute inset-0 flex items-center justify-center font-display text-6xl text-ink-muted"
            aria-hidden="true"
          >
            {{ province.name.charAt(0) }}
          </span>
        </div>

        <h3 class="mt-4 text-h3 leading-tight transition-colors group-hover:text-accent">{{ province.name }}</h3>
        <p v-if="province.capital" class="mt-1 text-kicker font-medium uppercase tracking-kicker text-ink-muted">
          Capital · {{ province.capital }}
        </p>
        <p v-if="province.summary" class="mt-3 line-clamp-3 grow text-sm leading-relaxed text-ink-soft">
          {{ province.summary }}
        </p>
        <span
          class="mt-5 inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker transition-colors group-hover:border-accent group-hover:text-accent"
        >
          Leer la guía <span aria-hidden="true">→</span>
        </span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { Province } from '../types/blog'
import annobonImage from '../assets/Annobón.png'
import biokoImage from '../assets/Bioko.png'
import centroSurImage from '../assets/centro-sur-location-map.jpg'
import kieNtemImage from '../assets/Kié-Ntem_in_Equatorial_Guinea_2020.svg'
import weleNzasImage from '../assets/Wele-Nzas_in_Equatorial_Guinea_2020.svg.png'
import litoralImage from '../assets/Litoral_in_Equatorial_Guinea_2020.svg.png'

const props = defineProps<{
  provinces: Province[]
}>()

const blogStore = useBlogStore()

// Fotos que no cargan: se muestra la inicial en su lugar
const failedImages = reactive(new Set<Province['id']>())

// Mapas de localización para las provincias que no tienen foto propia
const LOCATOR_MAPS: [string, string][] = [
  ['annobon', annobonImage],
  ['bioko', biokoImage],
  ['centro-sur', centroSurImage],
  ['kie-ntem', kieNtemImage],
  ['wele-nzas', weleNzasImage],
  ['litoral', litoralImage]
]

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')

const firstSentence = (text: string) => text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text

const entries = computed(() =>
  props.provinces.map((province) => {
    const key = normalize(`${province.slug} ${province.name}`)
    const map = LOCATOR_MAPS.find(([match]) => key.includes(match))?.[1]
    const info = blogStore.getProvinceInfoBySlug(province.slug)
    return {
      ...province,
      region: key.includes('annobon') || key.includes('bioko') ? 'Región insular' : 'Región continental',
      image: province.imageUrl || map,
      isMap: !province.imageUrl && Boolean(map),
      capital: info?.capital,
      summary: info ? firstSentence(info.description) : ''
    }
  })
)
</script>
