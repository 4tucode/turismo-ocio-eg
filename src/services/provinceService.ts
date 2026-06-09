import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'

export interface FirestoreProvince {
  id: string
  name: string
  slug: string
  icon: string
  imageUrl?: string
  imagePath?: string
  order: number
}

export interface ProvinceFormData {
  name: string
  icon: string
  imageFile?: File
  imageUrl?: string
  order?: number
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadProvinceImage(file: File): Promise<{ url: string; path: string }> {
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const path = `provinces/${fileName}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return { url, path }
}

export async function createProvince(data: ProvinceFormData): Promise<string> {
  let imageUrl = data.imageUrl ?? ''
  let imagePath = ''
  if (data.imageFile) {
    const result = await uploadProvinceImage(data.imageFile)
    imageUrl = result.url
    imagePath = result.path
  }
  const docRef = await addDoc(collection(db, 'provinces'), {
    name: data.name,
    slug: generateSlug(data.name),
    icon: data.icon,
    imageUrl,
    imagePath,
    order: data.order ?? 0,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export async function getAllProvinces(): Promise<FirestoreProvince[]> {
  const snapshot = await getDocs(collection(db, 'provinces'))
  const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreProvince))
  list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return list
}

export async function updateProvince(id: string, data: Partial<ProvinceFormData>): Promise<void> {
  const updateData: Record<string, unknown> = { updatedAt: serverTimestamp() }
  if (data.name !== undefined) {
    updateData.name = data.name
    updateData.slug = generateSlug(data.name)
  }
  if (data.icon !== undefined) updateData.icon = data.icon
  if (data.imageFile) {
    const result = await uploadProvinceImage(data.imageFile)
    updateData.imageUrl = result.url
    updateData.imagePath = result.path
  }
  await updateDoc(doc(db, 'provinces', id), updateData)
}

export async function deleteProvince(id: string): Promise<void> {
  await deleteDoc(doc(db, 'provinces', id))
}

export function subscribeProvinces(callback: (provinces: FirestoreProvince[]) => void): () => void {
  return onSnapshot(
    collection(db, 'provinces'),
    snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreProvince))
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      callback(list)
    },
    () => { /* silently ignore errors */ }
  )
}
