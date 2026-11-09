// Página de artículo con las etiquetas Open Graph ya escritas en el HTML.
// WhatsApp, Facebook, X o LinkedIn no ejecutan JavaScript: sin esto, al compartir un
// artículo la vista previa muestra el título y el logo genéricos de index.html en vez
// de la foto de portada. La web (Vue) arranca igual que siempre sobre este HTML.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Debe coincidir con SITE_URL de src/utils/seo.ts
const SITE_URL = 'https://turismo-ocio-eg.vercel.app'
const SITE_NAME = 'Turismo y Ocio'
const PROJECT_ID = 'turismo-ocio-eg'
const CATEGORIES = ['cultura', 'gastronomia', 'naturaleza', 'ocio', 'noticias']

type Fields = Record<string, { stringValue?: string } | undefined>

const str = (fields: Fields, key: string) => fields[key]?.stringValue?.trim() ?? ''

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

// Igual que plainExcerpt de editorial.ts: texto plano sin pegar los párrafos
const plainText = (html: string, max: number) => {
  const text = decodeEntities(html.replace(/<\/(p|h\d|li|div)>/gi, ' ').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max).trim() + '…'
}

async function findArticle(slug: string): Promise<Fields | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'posts' }],
            where: { fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } } },
            limit: 1
          }
        })
      }
    )
    if (!res.ok) return null
    const rows = (await res.json()) as Array<{ document?: { fields?: Fields } }>
    return rows[0]?.document?.fields ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function loadIndexHtml(origin: string): Promise<string> {
  try {
    return await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8')
  } catch {
    const res = await fetch(`${origin}/index.html`)
    return res.text()
  }
}

const setTag = (html: string, pattern: RegExp, tag: string) =>
  pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)

const metaPattern = (attr: string, key: string) => new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'i')

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug') ?? ''
  const category = url.searchParams.get('category') ?? ''

  let html = await loadIndexHtml(url.origin)
  const fields = slug ? await findArticle(slug) : null

  if (fields) {
    const articleCategory = str(fields, 'category')
    const path = CATEGORIES.includes(articleCategory)
      ? `/${articleCategory}/${slug}`
      : `/${category || 'post'}/${slug}`
    const pageUrl = SITE_URL + path
    const title = `${str(fields, 'seoTitle') || str(fields, 'title')} | ${SITE_NAME}`
    const description =
      str(fields, 'metaDescription') || plainText(str(fields, 'excerpt') || str(fields, 'content'), 155)
    const image = str(fields, 'imageUrl')

    const t = escapeAttr(title)
    const d = escapeAttr(description)
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`)
    html = setTag(html, metaPattern('name', 'description'), `<meta name="description" content="${d}" />`)
    html = setTag(html, metaPattern('property', 'og:title'), `<meta property="og:title" content="${t}" />`)
    html = setTag(html, metaPattern('property', 'og:description'), `<meta property="og:description" content="${d}" />`)
    html = setTag(html, metaPattern('property', 'og:type'), `<meta property="og:type" content="article" />`)
    html = setTag(html, metaPattern('property', 'og:url'), `<meta property="og:url" content="${escapeAttr(pageUrl)}" />`)
    html = setTag(html, metaPattern('property', 'og:site_name'), `<meta property="og:site_name" content="${SITE_NAME}" />`)
    html = setTag(html, metaPattern('name', 'twitter:title'), `<meta name="twitter:title" content="${t}" />`)
    html = setTag(html, metaPattern('name', 'twitter:description'), `<meta name="twitter:description" content="${d}" />`)
    html = setTag(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeAttr(pageUrl)}" />`)
    if (image) {
      const i = escapeAttr(image)
      html = setTag(html, metaPattern('property', 'og:image'), `<meta property="og:image" content="${i}" />`)
      html = setTag(html, metaPattern('property', 'og:image:alt'), `<meta property="og:image:alt" content="${t}" />`)
      html = setTag(html, metaPattern('name', 'twitter:image'), `<meta name="twitter:image" content="${i}" />`)
    }
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Los cambios de un artículo llegan a las vistas previas en unos minutos
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    }
  })
}
