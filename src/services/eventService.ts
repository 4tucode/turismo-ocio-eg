import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'

export interface FirestoreEvent {
  id: string
  title: string
  imageUrl: string
  imagePath?: string
  slug: string
  date: string
  excerpt: string
}

export interface EventFormData {
  title: string
  date: string
  excerpt: string
  imageFile?: File
  imageUrl?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadEventImage(file: File): Promise<{ url: string; path: string }> {
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const path = `events/${fileName}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return { url, path }
}

export async function createEvent(data: EventFormData): Promise<string> {
  let imageUrl = data.imageUrl ?? ''
  let imagePath = ''
  if (data.imageFile) {
    const result = await uploadEventImage(data.imageFile)
    imageUrl = result.url
    imagePath = result.path
  }
  const docRef = await addDoc(collection(db, 'events'), {
    title: data.title,
    slug: generateSlug(data.title),
    date: data.date,
    excerpt: data.excerpt,
    imageUrl,
    imagePath,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export async function getAllEvents(): Promise<FirestoreEvent[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'events'), orderBy('createdAt', 'desc')))
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreEvent))
  } catch {
    const snapshot = await getDocs(collection(db, 'events'))
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreEvent))
  }
}

export async function updateEvent(id: string, data: EventFormData): Promise<void> {
  let imageUrl = data.imageUrl ?? ''
  const updateData: Record<string, unknown> = {
    title: data.title,
    slug: generateSlug(data.title),
    date: data.date,
    excerpt: data.excerpt,
    imageUrl,
    updatedAt: serverTimestamp()
  }
  if (data.imageFile) {
    const result = await uploadEventImage(data.imageFile)
    updateData.imageUrl = result.url
    updateData.imagePath = result.path
  }
  await updateDoc(doc(db, 'events', id), updateData)
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'events', id))
}

export function subscribeEvents(callback: (events: FirestoreEvent[]) => void): () => void {
  return onSnapshot(
    collection(db, 'events'),
    snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreEvent))
      list.sort((a, b) => a.title.localeCompare(b.title))
      callback(list)
    },
    () => { /* silently ignore errors */ }
  )
}
