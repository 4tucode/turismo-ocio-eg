<template>
  <div class="mx-auto grid max-w-page gap-x-16 gap-y-10 px-(--gutter) py-16 lg:grid-cols-[4fr_8fr]">
    <header class="lg:sticky lg:top-8 lg:self-start">
      <p class="mb-3 flex items-center gap-3 text-kicker font-medium uppercase tracking-kicker text-ink">
        <span class="block h-px w-10 bg-accent" aria-hidden="true"></span>
        Guía práctica
      </p>
      <h2 class="text-h2 leading-none">Antes de hacer la maleta</h2>
      <p class="mt-5 max-w-sm font-serif text-lead leading-snug text-ink-soft">
        Alquiler, alojamiento y agencias para planificar el viaje con tranquilidad.
      </p>
    </header>

    <ol class="list-none border-t border-ink">
      <li
        v-for="(service, index) in services"
        :key="service.id"
        class="grid grid-cols-[3.5rem_1fr] items-start gap-x-6 gap-y-4 border-b border-rule py-6 sm:grid-cols-[3.5rem_1fr_12rem]"
      >
        <span class="font-display text-5xl leading-none text-accent" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <div>
          <p class="text-kicker font-medium uppercase tracking-kicker text-ink-muted">Servicios</p>
          <h3 class="mt-1 text-h3 leading-tight">{{ service.title }}</h3>
          <p v-if="service.description" class="mt-2 max-w-md leading-relaxed text-ink-soft">
            {{ service.description }}
          </p>
        </div>
        <div class="col-span-2 aspect-[16/9] overflow-hidden bg-paper sm:col-span-1 sm:aspect-[3/2]">
          <img :src="service.imageUrl" alt="" loading="lazy" class="block h-full w-full object-cover" />
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '../types/blog'

defineProps<{
  services: Service[]
}>()
</script>
