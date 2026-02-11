<template>
  <div class="admin-view">
    <!-- Pantalla de login -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-box">
        <h2>Acceso de Administrador</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Ingresa la contraseña"
              required
            />
          </div>
          <button type="submit" class="btn-primary">Entrar</button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </form>
      </div>
    </div>

    <!-- Panel de administración -->
    <div v-else class="admin-panel">
      <header class="admin-header">
        <h1>Panel de Administración</h1>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </header>

      <div class="admin-content">
        <!-- Formulario principal -->
        <main class="admin-main">
          <h2>{{ editingArticle ? 'Editar Artículo' : 'Nuevo Artículo' }}</h2>
          
          <form @submit.prevent="handleSubmit" class="article-form">
            <div class="form-group">
              <label for="title">Título *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                class="form-input"
                placeholder="Título del artículo"
                required
              />
            </div>

            <div class="form-group">
              <label for="category">Categoría *</label>
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="cultura">Cultura</option>
                <option value="gastronomia">Gastronomía</option>
                <option value="ocio">Ocio</option>
                <option value="naturaleza">Naturaleza</option>
                <option value="noticias">Noticias</option>
              </select>
            </div>

            <div class="form-group">
              <label for="date">Fecha *</label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="content">Cuerpo del Artículo *</label>
              <textarea
                id="content"
                v-model="formData.content"
                class="form-textarea"
                rows="10"
                placeholder="Escribe el contenido del artículo aquí..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="image">Imagen de Portada</label>
              <input
                id="image"
                type="file"
                accept=".jpg,.jpeg,.png"
                @change="handleImageChange"
                class="form-input"
              />
              <small class="form-help">Solo archivos .jpg, .jpeg, .png</small>
              <div v-if="formData.imageFile" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <span>{{ formData.imageFile.name }}</span>
              </div>
              <div v-if="editingArticle && editingArticle.imageUrl && !formData.imageFile" class="current-image">
                <p>Imagen actual:</p>
                <img :src="editingArticle.imageUrl" alt="Current" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting || isUploading">
                <span v-if="isUploading">Subiendo imagen... {{ uploadProgress }}%</span>
                <span v-else-if="isSubmitting">Guardando...</span>
                <span v-else>{{ editingArticle ? 'Actualizar' : 'Publicar' }}</span>
              </button>
              <button v-if="editingArticle" type="button" @click="cancelEdit" class="btn-secondary" :disabled="isSubmitting || isUploading">
                Cancelar
              </button>
            </div>

            <div v-if="isUploading" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
              <p class="progress-text">Subiendo imagen: {{ uploadProgress }}%</p>
            </div>

            <p v-if="submitError" class="error-message">{{ submitError }}</p>
            <p v-if="submitSuccess" class="success-message">{{ submitSuccess }}</p>
          </form>
        </main>

        <!-- Aside con lista de artículos -->
        <aside class="admin-aside">
          <h2>Artículos Existentes</h2>
          <div class="articles-list">
            <div v-if="loadingArticles" class="loading">Cargando artículos...</div>
            <div v-else-if="articles.length === 0" class="no-articles">
              No hay artículos aún
            </div>
            <div
              v-else
              v-for="article in articles"
              :key="article.id"
              class="article-item"
              :class="{ active: editingArticle?.id === article.id }"
            >
              <div class="article-item-content">
                <h3>{{ article.title }}</h3>
                <p class="article-meta">
                  <span class="category-badge" :class="article.category">
                    {{ article.category }}
                  </span>
                  <span class="date">{{ formatDate(article.date) }}</span>
                </p>
                <div v-if="article.imageUrl" class="article-thumbnail">
                  <img :src="article.imageUrl" :alt="article.title" />
                </div>
              </div>
              <div class="article-actions">
                <button @click="editArticle(article)" class="btn-edit">Editar</button>
                <button @click="confirmDelete(article)" class="btn-delete">Eliminar</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="articleToDelete" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>¿Eliminar artículo?</h3>
        <p>¿Estás seguro de que quieres eliminar "{{ articleToDelete.title }}"?</p>
        <div class="modal-actions">
          <button @click="handleDeleteArticle" class="btn-delete">Eliminar</button>
          <button @click="cancelDelete" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  createArticle, 
  getAllArticles, 
  updateArticle, 
  deleteArticle,
  type ArticleFormData
} from '../services/articleService'
import type { Article } from '../services/articleService'

const ADMIN_PASSWORD = 'admin'

const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')

const formData = reactive<ArticleFormData>({
  title: '',
  category: 'cultura' as ArticleFormData['category'],
  date: new Date().toISOString().split('T')[0],
  content: '',
  imageFile: undefined
})

const editingArticle = ref<Article | null>(null)
const articles = ref<Article[]>([])
const loadingArticles = ref(false)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const submitError = ref('')
const submitSuccess = ref('')
const articleToDelete = ref<Article | null>(null)

const imagePreview = computed(() => {
  if (formData.imageFile) {
    return URL.createObjectURL(formData.imageFile)
  }
  return ''
})

const handleLogin = () => {
  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    password.value = ''
    loginError.value = ''
    sessionStorage.setItem('admin_authenticated', 'true')
    loadArticles()
  } else {
    loginError.value = 'Contraseña incorrecta'
  }
}

const logout = () => {
  isAuthenticated.value = false
  editingArticle.value = null
  sessionStorage.removeItem('admin_authenticated')
  resetForm()
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (validTypes.includes(file.type)) {
      formData.imageFile = file
    } else {
      alert('Solo se permiten archivos .jpg, .jpeg o .png')
      target.value = ''
    }
  }
}

const resetForm = () => {
  formData.title = ''
  formData.category = 'cultura'
  formData.date = new Date().toISOString().split('T')[0]
  formData.content = ''
  formData.imageFile = undefined
  editingArticle.value = null
  submitError.value = ''
  submitSuccess.value = ''
}

const handleSubmit = async () => {
  isSubmitting.value = true
  isUploading.value = false
  uploadProgress.value = 0
  submitError.value = ''
  submitSuccess.value = ''

  try {
    // Si hay imagen, simular progreso (el SDK no tiene progreso nativo, pero podemos mostrar feedback)
    if (formData.imageFile) {
      isUploading.value = true
      uploadProgress.value = 30 // Inicio de subida
      
      // Simular progreso (en producción, podrías usar uploadBytesResumable con onProgress)
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10
        }
      }, 200)
      
      try {
        if (editingArticle.value) {
          await updateArticle(editingArticle.value.id, formData)
          submitSuccess.value = 'Artículo actualizado correctamente'
        } else {
          await createArticle(formData)
          submitSuccess.value = 'Artículo publicado correctamente'
        }
        uploadProgress.value = 100
        clearInterval(progressInterval)
      } catch (uploadError) {
        clearInterval(progressInterval)
        throw uploadError
      } finally {
        isUploading.value = false
        setTimeout(() => {
          uploadProgress.value = 0
        }, 500)
      }
    } else {
      // Sin imagen, solo guardar en Firestore
      if (editingArticle.value) {
        await updateArticle(editingArticle.value.id, formData)
        submitSuccess.value = 'Artículo actualizado correctamente'
      } else {
        await createArticle(formData)
        submitSuccess.value = 'Artículo publicado correctamente'
      }
    }
    
    resetForm()
    await loadArticles()
    
    setTimeout(() => {
      submitSuccess.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Error al guardar artículo:', error)
    isUploading.value = false
    uploadProgress.value = 0
    
    // Manejo específico de errores
    if (error.code === 'storage/unauthorized' || error.message?.includes('permisos') || error.message?.includes('permission')) {
      submitError.value = 'Error de permisos. Verifica las reglas de Firebase Storage y Firestore en Firebase Console y asegúrate de que estén PUBLICADAS.'
    } else if (error.code === 'storage/object-not-found' || error.message?.includes('404') || error.message?.includes('bucket')) {
      submitError.value = `Error de configuración: ${error.message || 'El bucket de Storage no existe o está mal configurado. Verifica Firebase Console.'}`
    } else if (error.message?.includes('CORS') || error.message?.includes('preflight')) {
      submitError.value = 'Error de CORS. Verifica: 1) Las reglas de Storage estén PUBLICADAS en Firebase Console, 2) El bucket existe y está habilitado, 3) Has reiniciado el servidor después de configurar las reglas.'
    } else {
      submitError.value = `Error al guardar el artículo: ${error.message || 'Error desconocido'}. Verifica la consola para más detalles.`
    }
  } finally {
    isSubmitting.value = false
  }
}

const loadArticles = async () => {
  loadingArticles.value = true
  try {
    articles.value = await getAllArticles()
  } catch (error) {
    console.error('Error al cargar artículos:', error)
    alert('Error al cargar los artículos')
  } finally {
    loadingArticles.value = false
  }
}

const editArticle = (article: Article) => {
  editingArticle.value = article
  formData.title = article.title
  formData.category = article.category || 'cultura'
  formData.date = article.date || new Date().toISOString().split('T')[0]
  formData.content = article.content
  formData.imageFile = undefined
  
  // Scroll al formulario
  document.querySelector('.admin-main')?.scrollIntoView({ behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const confirmDelete = (article: Article) => {
  articleToDelete.value = article
}

const cancelDelete = () => {
  articleToDelete.value = null
}

const handleDeleteArticle = async () => {
  if (!articleToDelete.value) return

  const deletedId = articleToDelete.value.id

  try {
    await deleteArticle(deletedId)
    await loadArticles()

    if (editingArticle.value?.id === deletedId) {
      resetForm()
    }

    articleToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar artículo:', error)
    alert('Error al eliminar el artículo')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

onMounted(() => {
  // Verificar si ya está autenticado (opcional, usando sessionStorage)
  const storedAuth = sessionStorage.getItem('admin_authenticated')
  if (storedAuth === 'true') {
    isAuthenticated.value = true
    loadArticles()
  }
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #0f172a;
  background-image: radial-gradient(circle at top, rgba(148, 163, 184, 0.15), transparent 60%);
  color: #0f172a;
}

/* Login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0f172a 100%);
  padding: 2rem 1.5rem;
}

.login-box {
  background: rgba(255, 255, 255, 0.98);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.login-box h2 {
  margin-bottom: 1.5rem;
  color: #0f172a;
  text-align: center;
  font-size: 1.5rem;
}

/* Admin Panel */
.admin-panel {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0f172a 100%);
  padding-top: 120px;
}

.admin-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.admin-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  padding: 2.5rem 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-main {
  background: white;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.admin-main h2 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #333;
}

.admin-aside {
  background: white;
  padding: 1.75rem;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  height: fit-content;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.admin-aside h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #333;
}

/* Formulario */
.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.85rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
}

.form-help {
  color: #666;
  font-size: 0.875rem;
}

.image-preview,
.current-image {
  margin-top: 1rem;
}

.image-preview img,
.current-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.image-preview span {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.75rem;
}

.btn-primary {
  background: #1f2937;
  color: white;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #1f2937;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.error-message {
  color: #d32f2f;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.success-message {
  color: #2e7d32;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.upload-progress {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  transition: width 0.3s ease;
}

.progress-text {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

/* Lista de artículos */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s;
  background: #ffffff;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-item.active {
  border-color: #4f46e5;
  background: #eef2ff;
}

.article-item-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.article-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.category-badge.cultura {
  background: #e3f2fd;
  color: #1976d2;
}

.category-badge.gastronomia {
  background: #fff3e0;
  color: #f57c00;
}

.category-badge.ocio {
  background: #f3e5f5;
  color: #7b1fa2;
}

.category-badge.naturaleza {
  background: #e8f5e9;
  color: #388e3c;
}

.category-badge.noticias {
  background: #fce4ec;
  color: #c2185b;
}

.date {
  color: #666;
}

.article-thumbnail {
  margin-top: 0.5rem;
}

.article-thumbnail img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btn-edit {
  flex: 1;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #1976d2;
}

.btn-delete {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #d32f2f;
}

.loading,
.no-articles {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content p {
  margin: 1rem 0;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .admin-content {
    grid-template-columns: 1fr;
  }
  
  .admin-aside {
    position: static;
    max-height: none;
  }
}
</style>
