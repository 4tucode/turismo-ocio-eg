import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: 'cultura' | 'gastronomia' | 'naturaleza' | 'ocio' | 'noticias'
  date: string
  imageUrl?: string
  imagePath?: string
  createdAt?: any
  updatedAt?: any
}

export interface ArticleFormData {
  title: string
  category: 'cultura' | 'gastronomia' | 'naturaleza' | 'ocio' | 'noticias'
  date: string
  content: string
  imageFile?: File
}

// Generar slug a partir del título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Subir imagen a Firebase Storage usando SDK oficial (uploadBytes + getDownloadURL)
// NOTA: El SDK internamente hace llamadas HTTP/XHR a firebasestorage.googleapis.com
// Esto es NORMAL y esperado. El SDK maneja CORS automáticamente si el bucket está bien configurado.
export async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  try {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `posts/${fileName}`
    
    // Crear referencia usando ref() del SDK
    const storageRef = ref(storage, storagePath)
    
    // Logs claros antes de subir
    const bucketReal = storage.app.options.storageBucket
    console.log('📤 [Firebase SDK] Iniciando subida:', {
      fileName,
      storagePath,
      bucketReal,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type
    })
    
    // Subir archivo usando uploadBytes() del SDK
    // Esto internamente hace XHR POST a firebasestorage.googleapis.com
    // pero el SDK maneja CORS automáticamente
    await uploadBytes(storageRef, file)
    
    console.log('✅ [Firebase SDK] Archivo subido, obteniendo URL...')
    
    // Obtener URL de descarga usando getDownloadURL() del SDK
    const downloadURL = await getDownloadURL(storageRef)
    
    console.log('✅ [Firebase SDK] Imagen subida correctamente:', {
      downloadURL,
      storagePath,
      bucketUsado: bucketReal
    })
    
    return {
      url: downloadURL,
      path: storagePath
    }
  } catch (error: any) {
    console.error('❌ [Firebase SDK] Error al subir imagen:', error)
    console.error('Detalles:', {
      code: error.code,
      message: error.message,
      bucket: storage.app.options.storageBucket
    })
    
    // Manejo específico de errores
    if (error.code === 'storage/unauthorized') {
      throw new Error('No tienes permisos para subir imágenes. Verifica las reglas de Storage en Firebase Console y asegúrate de que estén PUBLICADAS.')
    } else if (error.code === 'storage/canceled') {
      throw new Error('La subida de la imagen fue cancelada.')
    } else if (error.code === 'storage/object-not-found' || error.message?.includes('404')) {
      const bucket = storage.app.options.storageBucket
      throw new Error(`Bucket no encontrado (404). Verifica que el bucket "${bucket}" existe en Firebase Console. Debe ser "turismo-ocio-eg.appspot.com" (formato .appspot.com).`)
    } else if (
      error.message?.includes('CORS') || error.message?.includes('preflight') || error.message?.includes('blocked') ||
      error.message?.includes('Failed to fetch') || error.message?.includes('Network Error') || error.message?.includes('Load failed') ||
      error.code === 'storage/unknown'
    ) {
      const bucket = storage.app.options.storageBucket
      throw new Error(`Error de CORS en Storage. Configura CORS en el bucket con gsutil (archivo CONFIGURAR_CORS.md en la raíz del proyecto). Bucket: ${bucket}`)
    } else {
      throw new Error(`Error al subir la imagen: ${error.message || 'Error desconocido'}`)
    }
  }
}

// Crear artículo
export async function createArticle(data: ArticleFormData): Promise<void> {
  let imageUrl = ''
  let imagePath = ''
  
  // Subir imagen usando SDK de Firebase Storage (NO fetch/axios)
  if (data.imageFile) {
    const uploadResult = await uploadImage(data.imageFile)
    imageUrl = uploadResult.url
    imagePath = uploadResult.path
  }

  const slug = generateSlug(data.title)
  const excerpt = data.content.substring(0, 150) + '...'

  const articleData = {
    title: data.title,
    slug,
    excerpt,
    content: data.content,
    category: data.category,
    date: Timestamp.fromDate(new Date(data.date)),
    imageUrl,
    imagePath,
    createdAt: serverTimestamp(), // Usar serverTimestamp para consistencia
    updatedAt: serverTimestamp()
  }

  await addDoc(collection(db, 'posts'), articleData)
}

// Obtener todos los artículos
export async function getAllArticles(): Promise<Article[]> {
  try {
    // Intentar con ordenamiento
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || 'cultura',
        date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || ''),
        imageUrl: data.imageUrl || '',
        imagePath: data.imagePath || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    }) as Article[]
  } catch (error: any) {
    // Si falla por falta de índice, intentar sin ordenamiento
    if (error.code === 'failed-precondition') {
      const querySnapshot = await getDocs(collection(db, 'posts'))
      const articles = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || 'cultura',
          date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || ''),
        imageUrl: data.imageUrl || '',
        imagePath: data.imagePath || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
        }
      }) as Article[]
      // Ordenar manualmente
      return articles.sort((a, b) => {
        const aDate = a.createdAt?.toMillis?.() || 0
        const bDate = b.createdAt?.toMillis?.() || 0
        return bDate - aDate
      })
    }
    throw error
  }
}

// Obtener artículos por categoría
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const q = query(
    collection(db, 'posts'),
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate().toISOString().split('T')[0] || '',
  })) as Article[]
}

// Actualizar artículo
export async function updateArticle(
  articleId: string, 
  data: Partial<ArticleFormData>
): Promise<void> {
  const articleRef = doc(db, 'posts', articleId)
  const updateData: any = {
    updatedAt: serverTimestamp()
  }

  if (data.title) {
    updateData.title = data.title
    updateData.slug = generateSlug(data.title)
  }
  if (data.category) updateData.category = data.category
  if (data.date) updateData.date = Timestamp.fromDate(new Date(data.date))
  if (data.content) {
    updateData.content = data.content
    updateData.excerpt = data.content.substring(0, 150) + '...'
  }
  if (data.imageFile) {
    const uploadResult = await uploadImage(data.imageFile)
    updateData.imageUrl = uploadResult.url
    updateData.imagePath = uploadResult.path
  }

  await updateDoc(articleRef, updateData)
}

// Eliminar artículo
export async function deleteArticle(articleId: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', articleId))
}
