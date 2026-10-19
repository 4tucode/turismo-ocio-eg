import type { Article } from '../services/articleService'
import { categoryLabel, categoryPath, plainExcerpt } from './editorial'

// Dominio de producción: las URL canónicas apuntan siempre aquí, también desde las vistas previas
export const SITE_URL = 'https://turismo-ocio-eg.vercel.app'
const SITE_NAME = 'Turismo y Ocio'

const JSON_LD_ID = 'article-jsonld'

// Valores de index.html, para restaurarlos al salir de un artículo
const defaults = {
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
}

// Ruta única de cada artículo: /{categoría}/{slug}, salvo 'noticias', que no tiene sección y usa /post/{slug}
export const articlePath = (article: Pick<Article, 'category' | 'slug'>) =>
  categoryPath(article.category) === '/' ? `/post/${article.slug}` : `/${article.category}/${article.slug}`

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const removeMeta = (attr: 'name' | 'property', key: string) => {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

const setCanonical = (href: string | null) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

const setJsonLd = (json: string | null) => {
  let el = document.getElementById(JSON_LD_ID)
  if (!json) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = JSON_LD_ID
    el.setAttribute('type', 'application/ld+json')
    document.head.appendChild(el)
  }
  el.textContent = json
}

// JSON-LD mínimo para los artículos que no traen uno propio en Firestore
const fallbackJsonLd = (article: Article, url: string, description: string) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title.trim(),
    description,
    image: article.imageUrl || undefined,
    datePublished: article.date || undefined,
    inLanguage: 'es',
    articleSection: categoryLabel(article.category),
    author: { '@type': 'Person', name: 'Silvia', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
    mainEntityOfPage: url
  })

// Un JSON-LD guardado a mano que no sea JSON válido se descarta, para no publicar un bloque roto
const validJsonLd = (json?: string) => {
  if (!json) return null
  try {
    JSON.parse(json)
    return json
  } catch {
    return null
  }
}

export function applyArticleSeo(article: Article) {
  const url = SITE_URL + articlePath(article)
  const title = `${(article.seoTitle || article.title).trim()} | ${SITE_NAME}`
  const description = article.metaDescription?.trim() || plainExcerpt(article, 155)

  document.title = title
  setMeta('name', 'description', description)
  setCanonical(url)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', 'article')
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  if (article.imageUrl) {
    setMeta('property', 'og:image', article.imageUrl)
    setMeta('name', 'twitter:image', article.imageUrl)
  }
  setJsonLd(validJsonLd(article.jsonLd) ?? fallbackJsonLd(article, url, description))
}

export function resetSeo() {
  document.title = defaults.title
  setMeta('name', 'description', defaults.description)
  setCanonical(null)
  setMeta('property', 'og:title', SITE_NAME)
  setMeta('property', 'og:type', 'website')
  removeMeta('property', 'og:url')
  removeMeta('property', 'og:image')
  setMeta('name', 'twitter:title', SITE_NAME)
  removeMeta('name', 'twitter:image')
  setJsonLd(null)
}
