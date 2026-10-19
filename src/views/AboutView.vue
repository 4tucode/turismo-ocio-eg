<template>
  <article class="mx-auto max-w-page px-(--gutter) pt-10 pb-20">
    <header class="[border-bottom:4px_double_var(--color-ink)] pb-10">
      <nav class="mb-8 text-kicker font-medium uppercase tracking-kicker text-ink-muted" aria-label="Migas de pan">
        <RouterLink to="/" class="text-ink-muted no-underline hover:text-accent">Inicio</RouterLink>
        <span class="mx-2" aria-hidden="true">/</span>
        <span class="text-accent" aria-current="page">Acerca de</span>
      </nav>

      <div class="mx-auto max-w-[52rem] text-center">
        <p class="mb-4 text-kicker font-medium uppercase tracking-kicker text-accent">La autora</p>
        <h1 class="text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02]">Historias que conectan personas y lugares</h1>
        <p class="mx-auto mt-6 max-w-2xl font-serif text-[1.375rem] leading-snug text-ink-soft">
          Periodista y narradora de viajes, Silvia convierte historias locales en rutas, experiencias y
          recomendaciones para acercarse a Guinea Ecuatorial con una mirada auténtica.
        </p>
        <p
          class="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-1 border-y border-rule py-3 text-kicker font-medium uppercase tracking-kicker text-ink-muted"
        >
          <span>Por <span class="text-ink">Silvia</span></span>
          <span aria-hidden="true">·</span>
          <span>Periodista</span>
          <span aria-hidden="true">·</span>
          <span>Cultura y turismo</span>
        </p>
      </div>
    </header>

    <div class="grid gap-x-16 gap-y-14 pt-12 lg:grid-cols-[8fr_4fr]">
      <div class="about-body mx-auto w-full max-w-[42rem] lg:mx-0">
        <h2>Quién es Silvia</h2>
        <p class="drop-cap">
          Silvia es una entusiasta de las historias que conectan personas y lugares. Su formación en
          Periodismo le dio las herramientas para investigar, escuchar y contar con rigor lo que hace
          especial cada destino.
        </p>

        <blockquote>
          <p>«Historias locales convertidas en rutas, experiencias y recomendaciones.»</p>
        </blockquote>

        <h2>Qué encontrarás en este blog</h2>
        <p>
          Este rincón digital no es solo una colección de guías de destinos. Su objetivo es ayudarte a
          planificar el viaje con confianza, a partir de datos reales, cultura viva y recomendaciones
          locales.
        </p>

        <h2>Fuera de la redacción</h2>
        <p>
          Cuando no está escribiendo o editando fotos, lo más probable es encontrarla paseando por
          mercados, conversando con artesanos o buscando el café perfecto.
        </p>
      </div>

      <aside class="lg:col-start-2" aria-labelledby="ficha">
        <div class="border-t-4 border-ink bg-paper-alt p-6">
          <h2 id="ficha" class="text-kicker font-sans font-medium uppercase tracking-kicker text-ink">Ficha</h2>
          <div class="mt-5 flex items-center gap-4 border-b border-rule pb-5">
            <span
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-3xl text-paper"
              aria-hidden="true"
            >
              S
            </span>
            <div>
              <p class="font-display text-2xl leading-tight">Silvia</p>
              <p class="mt-1 text-sm text-ink-soft">Periodista · Cultura y turismo</p>
            </div>
          </div>

          <h3 class="mt-5 text-kicker font-sans font-medium uppercase tracking-kicker text-ink-muted">Escribe sobre</h3>
          <ul class="mt-2 list-none">
            <li v-for="section in sections" :key="section.to" class="border-b border-rule last:border-b-0">
              <RouterLink :to="section.to" class="group flex items-baseline justify-between gap-4 py-3 text-ink no-underline">
                <span class="font-serif text-lg transition-colors group-hover:text-accent">{{ section.label }}</span>
                <span class="text-ink-muted transition-colors group-hover:text-accent" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <section
      class="mt-20 border-y border-ink py-12 text-center"
      aria-labelledby="acompaname"
    >
      <p class="mb-3 text-kicker font-medium uppercase tracking-kicker text-accent">Sigue leyendo</p>
      <h2 id="acompaname" class="text-h2 leading-none">¿Te unes a la aventura?</h2>
      <p class="mx-auto mt-5 max-w-lg font-serif text-lead leading-snug text-ink-soft">
        No te pierdas nada y acompáñala en cada ruta, historia y descubrimiento.
      </p>
      <RouterLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-kicker font-medium uppercase tracking-kicker text-paper no-underline transition-colors hover:bg-accent"
      >
        Explorar el blog <span aria-hidden="true">→</span>
      </RouterLink>
    </section>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const sections = [
  { label: 'Cultura e Historia', to: '/cultura' },
  { label: 'Naturaleza y Aventura', to: '/naturaleza' },
  { label: 'Gastronomía', to: '/gastronomia' },
  { label: 'Ocio y Entretenimiento', to: '/ocio' }
]
</script>

<style scoped>
/* Mismo tratamiento de texto que el cuerpo de los artículos */
.about-body {
  font-family: var(--font-body);
  font-size: 1.1875rem;
  line-height: 1.75;
}

.about-body p {
  margin-bottom: 1.5em;
}

.about-body h2 {
  margin: 2.4em 0 0.7em;
  font-size: 2rem;
  line-height: 1.15;
}

.about-body h2:first-child {
  margin-top: 0;
}

.drop-cap::first-letter {
  float: left;
  margin: 0.08em 0.12em 0 0;
  font-family: var(--font-display);
  font-size: 4.6em;
  line-height: 0.8;
  color: var(--color-accent);
}

.about-body blockquote {
  margin: 2.25em 0;
  padding: 0.25em 0 0.25em 1.25em;
  border-left: 3px solid var(--color-accent);
  font-size: 1.45rem;
  font-style: italic;
  line-height: 1.4;
}

.about-body blockquote p {
  margin: 0;
}

@media (max-width: 640px) {
  .about-body {
    font-size: 1.0625rem;
  }

  .about-body blockquote {
    font-size: 1.25rem;
  }
}
</style>
