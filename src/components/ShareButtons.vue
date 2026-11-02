<template>
  <!-- Se adapta al ancho de su columna, no al de la ventana: va bajo la foto y al final del texto -->
  <div class="@container">
    <p v-if="label" class="mb-3 text-kicker font-medium uppercase tracking-kicker text-ink-muted">{{ label }}</p>
    <ul class="grid list-none grid-cols-2 gap-2 @md:grid-cols-5">
      <li v-for="network in networks" :key="network.name">
        <a
          :href="network.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-11 items-center justify-center gap-2 text-white no-underline transition-opacity hover:opacity-85"
          :style="{ backgroundColor: network.color }"
          :aria-label="`Compartir en ${network.name} (se abre en una ventana nueva)`"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="network.icon" />
          </svg>
          <span class="text-kicker font-medium uppercase tracking-kicker @md:sr-only @4xl:not-sr-only">
            {{ network.name }}
          </span>
        </a>
      </li>
      <li class="col-span-2 @md:col-span-1">
        <button
          type="button"
          class="flex h-11 w-full items-center justify-center gap-2 border border-ink bg-transparent p-0 text-ink transition-colors hover:bg-ink hover:text-paper"
          @click="copyLink"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
          </svg>
          <span class="text-kicker font-medium uppercase tracking-kicker">
            {{ copied ? 'Copiado' : 'Copiar' }}<span v-if="!copied" class="@md:@max-4xl:hidden"> enlace</span>
          </span>
        </button>
        <span class="sr-only" aria-live="polite">{{ copied ? 'Enlace copiado al portapapeles' : '' }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps<{
  url: string
  title: string
  label?: string
}>()

const ICONS = {
  facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  whatsapp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
}

const networks = computed(() => {
  const url = encodeURIComponent(props.url)
  const text = encodeURIComponent(props.title.trim())
  return [
    { name: 'Facebook', color: '#3b5998', icon: ICONS.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'X', color: '#000000', icon: ICONS.x, href: `https://x.com/intent/post?url=${url}&text=${text}` },
    { name: 'WhatsApp', color: '#1e6e5c', icon: ICONS.whatsapp, href: `https://wa.me/?text=${text}%20${url}` },
    { name: 'LinkedIn', color: '#0a66c2', icon: ICONS.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` }
  ]
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
  } catch {
    // Sin permiso de portapapeles (o en http): se deja seleccionar el enlace a mano
    window.prompt('Copia este enlace:', props.url)
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2500)
}

onUnmounted(() => clearTimeout(timer))
</script>
