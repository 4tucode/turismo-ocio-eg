import type { Article } from '../services/articleService'

export const CATEGORY_LABELS: Record<Article['category'], string> = {
  cultura: 'Cultura',
  gastronomia: 'Gastronomía',
  naturaleza: 'Naturaleza',
  ocio: 'Ocio',
  noticias: 'Noticias'
}

export const categoryLabel = (category?: string) =>
  (category && CATEGORY_LABELS[category as Article['category']]) || 'Actualidad'

// Ruta de la portada de sección; 'noticias' no tiene página propia
export const categoryPath = (category?: string) =>
  category && category !== 'noticias' && category in CATEGORY_LABELS ? `/${category}` : '/'

export const formatLongDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const toPlainText = (html: string) => {
  // Espacio tras cada bloque para que no se peguen los párrafos al quitar las etiquetas
  const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote)>/g, '$& ')
  const doc = new DOMParser().parseFromString(spaced, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

// El extracto guardado son los primeros 150 caracteres del HTML del cuerpo, con etiquetas incluidas
export const plainExcerpt = (article: Pick<Article, 'excerpt' | 'content'>, maxLength = 160) => {
  const text = toPlainText(article.content || article.excerpt || '')
  if (text.length <= maxLength) return text
  return `${text.slice(0, text.lastIndexOf(' ', maxLength)).replace(/[,;:.]$/, '')}…`
}

export const readingMinutes = (html?: string) => {
  if (!html) return 1
  const words = toPlainText(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
