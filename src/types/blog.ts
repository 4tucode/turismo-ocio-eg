export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  imageUrl?: string
  tags: string[]
  category?: 'cultura' | 'naturaleza' | 'gastronomia' | 'ocio' | 'eventos' | 'provincias' | 'general'
  featured?: boolean
}

export interface Author {
  name: string
  bio: string
  avatar?: string
}

export interface Sponsor {
  id: number
  name: string
  logo: string
  website: string
}

export interface Event {
  id: number
  title: string
  imageUrl: string
  slug: string
  date: string
  excerpt: string
}

export interface Province {
  id: number
  name: string
  slug: string
  icon: string
}

export interface ProvinceInfo {
  id: number
  name: string
  slug: string
  capital: string
  description: string
  heroImage: string
  infoCards: {
    id: number
    title: string
    content: string
    icon: string
    imageUrl?: string
  }[]
  highlights: {
    id: number
    title: string
    description: string
    imageUrl: string
  }[]
  facts: string[]
  gallery: string[]
}

export interface Banner {
  id: number
  imageUrl: string
  link?: string
  alt: string
}

export interface Slide {
  id: number
  imageUrl: string
  videoUrl?: string
  title: string
  subtitle: string
  link: string
}

export interface Service {
  id: number
  title: string
  imageUrl: string
  slug: string
  description?: string
}

export interface CulturaArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  location?: string
  category?: 'cultura' | 'gastronomia' | 'naturaleza' | 'ocio'
}