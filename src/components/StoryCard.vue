<template>
  <RouterLink
    :to="to"
    class="group text-ink no-underline"
    :class="{
      'grid items-center gap-x-10 gap-y-5 md:grid-cols-[7fr_5fr]': variant === 'lead',
      'flex flex-col': variant === 'standard' || variant === 'compact',
      'grid grid-cols-[1fr_7rem] items-start gap-5 sm:grid-cols-[1fr_11rem]': variant === 'row'
    }"
  >
    <div
      v-if="article.imageUrl && variant !== 'compact'"
      class="overflow-hidden bg-paper-alt"
      :class="{
        'aspect-[4/3] md:order-2': variant === 'lead',
        'mb-4 aspect-[4/3]': variant === 'standard',
        'order-2 aspect-[4/3]': variant === 'row'
      }"
    >
      <img
        :src="article.imageUrl"
        :alt="variant === 'lead' ? article.title : ''"
        :loading="variant === 'lead' ? 'eager' : 'lazy'"
        class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div>
      <p class="mb-2 text-kicker font-medium uppercase tracking-kicker text-accent">
        {{ kicker ?? categoryLabel(article.category) }}
      </p>
      <component
        :is="headingTag"
        class="leading-[1.1] transition-colors group-hover:text-accent"
        :class="{
          'text-[clamp(2rem,4.5vw,3.5rem)]': variant === 'lead',
          'text-h3': variant === 'standard' || variant === 'row',
          'font-serif text-lg leading-snug tracking-normal': variant === 'compact'
        }"
      >
        {{ article.title }}
      </component>
      <p
        v-if="variant !== 'compact'"
        class="mt-3 leading-relaxed text-ink-soft"
        :class="variant === 'lead' ? 'font-serif text-lead' : 'line-clamp-3 text-sm'"
      >
        {{ plainExcerpt(article, variant === 'lead' ? 220 : 160) }}
      </p>
      <p class="mt-3 text-kicker font-medium uppercase tracking-kicker text-ink-muted">
        <time :datetime="article.date">{{ formatLongDate(article.date) }}</time>
        <template v-if="article.location"> · {{ article.location }}</template>
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '../services/articleService'
import { categoryLabel, formatLongDate, plainExcerpt } from '../utils/editorial'

const props = withDefaults(
  defineProps<{
    article: Article
    to: string
    variant?: 'lead' | 'standard' | 'compact' | 'row'
    kicker?: string
  }>(),
  { variant: 'standard', kicker: undefined }
)

const headingTag = computed(() => (props.variant === 'lead' ? 'h2' : 'h3'))
</script>
