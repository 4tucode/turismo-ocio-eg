
<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <header class="relative z-20 bg-paper text-ink">
      <div class="border-b border-rule bg-paper-alt">
        <div class="mx-auto flex max-w-page items-center justify-between gap-4 px-(--gutter) py-2 text-kicker font-medium uppercase tracking-kicker">
          <span>Malabo · {{ today }}</span>
          <span class="hidden sm:inline">Guinea Ecuatorial</span>
        </div>
      </div>

      <div class="mx-auto grid max-w-page grid-cols-[1fr_auto_1fr] items-center gap-4 px-(--gutter) py-3 lg:py-4">
        <div>
          <button
            class="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-rule bg-transparent p-0 lg:hidden"
            type="button"
            aria-controls="nav-principal"
            :aria-expanded="isMenuOpen"
            :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
            @click="toggleMenu"
          >
            <span class="block h-px w-4 bg-ink"></span>
            <span class="block h-px w-4 bg-ink"></span>
          </button>
        </div>

        <RouterLink to="/" class="block" @click="closeMenu">
          <img :src="logoImage" alt="Turismo y ocio EG - Inicio" class="block h-20 w-auto lg:h-28" />
        </RouterLink>

        <p class="hidden justify-self-end text-right text-sm leading-relaxed text-ink-soft md:block">
          Cultura, naturaleza y ocio<br />en Guinea Ecuatorial
        </p>
      </div>

      <nav
        id="nav-principal"
        class="border-y border-rule lg:block"
        :class="isMenuOpen ? 'block' : 'hidden'"
        aria-label="Navegación principal"
      >
        <div class="mx-auto flex max-w-page flex-col px-(--gutter) lg:flex-row lg:justify-between">
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="-mb-px border-b border-rule py-4 text-kicker font-medium uppercase tracking-kicker no-underline transition-colors hover:text-accent lg:border-b-2"
            :class="isActive(link) ? 'text-accent lg:border-accent' : 'text-ink-soft lg:border-transparent'"
            :aria-current="isActive(link) ? 'page' : undefined"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </nav>
    </header>

    <main id="main-content" class="main">
      <RouterView />
    </main>

    <footer class="relative z-10 border-t-2 border-ink bg-paper-alt text-ink">
      <div class="mx-auto grid max-w-page gap-10 px-(--gutter) py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <img :src="logoImage" alt="Turismo y ocio EG" class="-ml-3 block h-28 w-auto" />
          <p class="mt-2 max-w-xs font-serif text-lead leading-snug text-ink-soft">
            Descubre Guinea Ecuatorial: cultura, naturaleza y tradición.
          </p>
        </div>

        <div>
          <p class="mb-4 text-kicker font-medium uppercase tracking-kicker text-accent">Enlaces rápidos</p>
          <ul class="flex list-none flex-col gap-3">
            <li v-for="link in footerLinks" :key="link.label">
              <RouterLink :to="link.to" class="font-serif text-ink no-underline transition-colors hover:text-accent">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="mb-4 text-kicker font-medium uppercase tracking-kicker text-accent">Síguenos</p>
          <div class="flex gap-4">
            <a class="text-ink-soft transition-colors hover:text-accent" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a class="text-ink-soft transition-colors hover:text-accent" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a class="text-ink-soft transition-colors hover:text-accent" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a class="text-ink-soft transition-colors hover:text-accent" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          
          </div>
        </div>

        <div>
          <p class="mb-4 text-kicker font-medium uppercase tracking-kicker text-accent">Desarrollado por</p>
          <img :src="logo4tucode" alt="4tucode" class="block h-auto w-32 max-w-full" />
        </div>
      </div>

      <div class="border-t border-rule">
        <p class="mx-auto max-w-page px-(--gutter) py-5 text-kicker uppercase tracking-kicker text-ink-muted">
          &copy; 2026 Turismo y Ocio EG. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import logoImage from './assets/logo-nuevo.png'
import logo4tucode from './assets/4tucode.png'

interface NavLink {
  label: string
  to: string
}

const navLinks: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Categorías', to: '/#categorias' },
  { label: 'Eventos', to: '/#eventos' },
  { label: 'Provincias', to: '/#provincias' },
  { label: 'Servicios', to: '/#servicios' },
  { label: 'Acerca de', to: '/about' }
]

const footerLinks: NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Acerca de', to: '/about' },
  { label: 'Hospedaje', to: '/#servicios' },
  { label: 'Transporte', to: '/#servicios' }
]

const route = useRoute()
const isMenuOpen = ref(false)

const today = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const isActive = (link: NavLink) => link.to === route.path + route.hash

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) closeMenu()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
/* Skip link para teclado/lectores de pantalla */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0.75rem;
  background: var(--color-ink);
  color: var(--color-paper);
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 9999;
  text-decoration: none;
  transition: top 0.15s;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  width: 100%;
  padding: 0;
  background-color: var(--color-paper);
  position: relative;
  z-index: 5;
}
</style>
