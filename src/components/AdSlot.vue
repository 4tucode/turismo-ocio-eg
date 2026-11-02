<template>
  <aside class="border border-rule bg-paper-alt p-6 text-center" aria-label="Publicidad">
    <p class="text-kicker font-medium uppercase tracking-kicker text-ink-muted">Publicidad</p>
    <p class="mt-4 font-display text-2xl leading-tight text-ink">Tu marca, aquí</p>
    <p class="mt-3 text-sm leading-relaxed text-ink-soft">
      Llega a quienes planean su viaje por Guinea Ecuatorial: hoteles, restaurantes, agencias y eventos.
    </p>
    <a
      v-if="contactHref"
      :href="contactHref"
      class="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-kicker font-medium uppercase tracking-kicker text-ink no-underline transition-colors hover:border-accent hover:text-accent"
    >
      Anúnciate con nosotros <span aria-hidden="true">→</span>
    </a>
  </aside>
</template>

<script setup lang="ts">
import { CONTACT, phoneHref } from '../config/contact'

const contactHref = CONTACT.email
  ? `mailto:${CONTACT.email}?subject=${encodeURIComponent('Publicidad en Turismo y Ocio')}`
  : CONTACT.phone
    ? phoneHref(CONTACT.phone)
    : ''
</script>
