<template>
  <div class="mx-auto max-w-page px-(--gutter) py-20">
    <header class="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <p class="mb-3 flex items-center gap-3 text-kicker font-medium uppercase tracking-kicker text-on-dark">
          <span class="block h-px w-10 bg-accent-soft" aria-hidden="true"></span>
          Agenda
        </p>
        <h2 class="text-h2 leading-none text-on-dark">{{ title }}</h2>
      </div>
      <p class="max-w-sm font-serif text-lead leading-snug text-on-dark-muted">
        Festivales, ferias y citas culturales que hacen vibrar cada provincia.
      </p>
    </header>

    <div v-if="lead" class="grid gap-x-16 gap-y-10 lg:grid-cols-[7fr_5fr]">
      <RouterLink :to="eventLink(lead)" class="group block no-underline">
        <div class="aspect-[16/10] overflow-hidden bg-dark-rule">
          <img
            :src="lead.imageUrl"
            :alt="lead.title"
            loading="lazy"
            class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p class="mt-5 text-kicker font-medium uppercase tracking-kicker text-accent-soft">
          {{ categoryLabel(lead) }} · {{ formatLong(lead.date) }}
        </p>
        <h3 class="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05] text-on-dark transition-colors group-hover:text-accent-soft">
          {{ lead.title }}
        </h3>
        <p class="mt-3 max-w-xl leading-relaxed text-on-dark-muted">{{ lead.excerpt }}</p>
      </RouterLink>

      <ol v-if="rest.length > 0" class="list-none border-t border-dark-rule">
        <li v-for="event in rest" :key="event.id" class="border-b border-dark-rule">
          <RouterLink :to="eventLink(event)" class="group grid grid-cols-[4rem_1fr] items-start gap-5 py-5 no-underline">
            <time :datetime="event.date" class="block text-center">
              <span class="block font-display text-4xl leading-none text-on-dark">{{ dayOf(event.date) }}</span>
              <span class="mt-1 block text-kicker font-medium uppercase tracking-kicker text-accent-soft">
                {{ monthOf(event.date) }}
              </span>
            </time>
            <div>
              <p class="text-kicker font-medium uppercase tracking-kicker text-on-dark-muted">
                {{ categoryLabel(event) }}
              </p>
              <h3 class="mt-1 font-serif text-xl leading-snug tracking-normal text-on-dark transition-colors group-hover:text-accent-soft">
                {{ event.title }}
              </h3>
              <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-on-dark-muted">{{ event.excerpt }}</p>
            </div>
          </RouterLink>
        </li>
      </ol>
    </div>

    <div v-else class="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink
        v-for="(category, index) in categories"
        :key="category.key"
        :to="`/eventos/${category.key}`"
        class="group relative flex flex-col border-b border-dark-rule py-8 no-underline before:absolute before:inset-y-0 before:-left-6 before:hidden before:w-px before:bg-dark-rule lg:border-b-0 lg:py-0"
        :class="{ 'sm:before:block': index % 2 === 1, 'lg:before:block': index > 0 }"
      >
        <p class="mb-3 flex items-baseline justify-between text-kicker font-medium uppercase tracking-kicker">
          <span class="text-accent-soft">Agenda</span>
          <span class="text-on-dark-muted" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        </p>
        <div class="aspect-[4/3] overflow-hidden bg-dark-rule">
          <img
            :src="category.image"
            alt=""
            loading="lazy"
            class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <h3 class="mt-4 text-h3 leading-tight text-on-dark transition-colors group-hover:text-accent-soft">
          {{ category.label }}
        </h3>
        <p class="mt-2 grow text-sm leading-relaxed text-on-dark-muted">{{ category.description }}</p>
        <span class="mt-5 inline-flex items-center gap-2 self-start border-b border-on-dark pb-1 text-kicker font-medium uppercase tracking-kicker text-on-dark">
          Ver agenda <span aria-hidden="true">→</span>
        </span>
      </RouterLink>
    </div>

    <nav
      v-if="lead"
      class="mt-12 grid border-t border-on-dark sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Categorías de eventos"
    >
      <RouterLink
        v-for="(category, index) in categories"
        :key="category.key"
        :to="`/eventos/${category.key}`"
        class="group flex items-baseline justify-between gap-3 border-b border-dark-rule py-5 no-underline lg:border-b-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
        :class="[
          index % 2 === 0 ? 'sm:max-lg:pr-4' : 'sm:max-lg:border-l sm:max-lg:pl-4',
          { 'lg:border-l': index > 0 }
        ]"
      >
        <span class="font-display text-2xl text-on-dark transition-colors group-hover:text-accent-soft">
          {{ category.label }}
        </span>
        <span class="whitespace-nowrap text-kicker font-medium uppercase tracking-kicker text-on-dark-muted">
          {{ category.count }} <span aria-hidden="true">→</span>
        </span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Event, EventCategory } from '../types/blog'
import festivalImage from '../assets/festival.jpg'
import arteImage from '../assets/arte.jpg'
import gastronomiaImage from '../assets/comidaguineana.jpg'
import deporteImage from '../assets/deporte.jfif'

const LIST_SIZE = 4

const CATEGORY_LABELS: Record<EventCategory, string> = {
  musical: 'Musicales',
  artistico: 'Artísticos',
  gastronomico: 'Gastronómicos',
  deportivo: 'Deportivos'
}

const CATEGORY_DETAILS: Record<EventCategory, { image: string; description: string }> = {
  musical: { image: festivalImage, description: 'Conciertos, festivales y noches de música en directo.' },
  artistico: { image: arteImage, description: 'Exposiciones, teatro, danza y artesanía.' },
  gastronomico: { image: gastronomiaImage, description: 'Ferias, degustaciones y cocina tradicional.' },
  deportivo: { image: deporteImage, description: 'Torneos, carreras y citas para la afición.' }
}

const props = defineProps<{
  events: Event[]
}>()

// Las fechas llegan como 'AAAA-MM-DD'; se interpretan en hora local para no desplazar el día
const parseDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  const date = year && month && day ? new Date(year, month - 1, day) : new Date(value)
  return isNaN(date.getTime()) ? null : date
}

const timeOf = (event: Event) => parseDate(event.date)?.getTime() ?? 0

// Los eventos de ejemplo del store no tienen categoría; solo se listan los publicados
const published = computed(() => props.events.filter((event) => event.category))

const upcoming = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0)
  return published.value.filter((event) => timeOf(event) >= today).sort((a, b) => timeOf(a) - timeOf(b))
})

const hasUpcoming = computed(() => upcoming.value.length > 0)

// Sin eventos futuros se muestran los más recientes
const agenda = computed(() =>
  hasUpcoming.value ? upcoming.value : [...published.value].sort((a, b) => timeOf(b) - timeOf(a))
)

const lead = computed(() => agenda.value[0])

const title = computed(() => {
  if (hasUpcoming.value) return 'Lo que viene'
  return lead.value ? 'Lo último en la agenda' : 'Qué hacer y cuándo'
})
const rest = computed(() => agenda.value.slice(1, 1 + LIST_SIZE))

const categories = computed(() =>
  (Object.keys(CATEGORY_LABELS) as EventCategory[]).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    ...CATEGORY_DETAILS[key],
    count: props.events.filter((event) => event.category === key).length
  }))
)

const categoryLabel = (event: Event) => (event.category ? CATEGORY_LABELS[event.category] : 'Evento')

const eventLink = (event: Event) => (event.category ? `/eventos/${event.category}` : '/#eventos')

const dayOf = (value: string) => parseDate(value)?.getDate() ?? ''

const monthOf = (value: string) =>
  parseDate(value)?.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '') ?? ''

const formatLong = (value: string) =>
  parseDate(value)?.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) ?? value
</script>
