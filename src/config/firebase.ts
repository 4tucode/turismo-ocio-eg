// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Initialize Storage usando SDK oficial
// getStorage() usa automáticamente el bucket del firebaseConfig
export const storage = getStorage(app)

// Log para diagnóstico (solo en desarrollo)
if (import.meta.env.DEV) {
  const bucketFromConfig = firebaseConfig.storageBucket
  const actualBucket = storage.app.options.storageBucket
  
  console.log('🔥 Firebase Storage configurado:', {
    bucketFromEnv: bucketFromConfig,
    actualBucketUsado: actualBucket,
    proyecto: firebaseConfig.projectId
  })
  
  if (!actualBucket) {
    console.error('❌ El bucket de Storage no está configurado. Revisa .env (VITE_FIREBASE_STORAGE_BUCKET) y Firebase Console > Storage > Settings.')
  } else {
    console.log('✅ Bucket en uso:', actualBucket)
    console.log('   Si hay error de CORS al subir, configura CORS en el bucket: ver CONFIGURAR_CORS.md')
  }
}

// Initialize Analytics only in browser
if (typeof window !== 'undefined') {
  getAnalytics(app)
}

export default app
