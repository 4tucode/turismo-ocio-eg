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
          <p v-if="loginError" class="error-message" role="alert" aria-live="assertive">{{ loginError }}</p>
        </form>
      </div>
    </div>

    <!-- Panel de administración -->
    <div v-else class="admin-panel">
      <header class="admin-header">
        <h1>Panel de Administración</h1>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </header>

      <!-- Tabs de navegación -->
      <nav class="admin-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'articles' }"
          @click="activeTab = 'articles'"
        >Artículos</button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'provinces' }"
          @click="activeTab = 'provinces'"
        >Provincias</button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'events' }"
          @click="activeTab = 'events'"
        >Eventos</button>
      </nav>

      <!-- ===== TAB ARTÍCULOS ===== -->
      <div v-if="activeTab === 'articles'" class="admin-content">
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
              <label>Cuerpo del Artículo *</label>
              <div class="editor-wrapper">
                <!-- Barra de herramientas -->
                <div class="editor-toolbar" role="toolbar" aria-label="Herramientas de texto">
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('bold') }"
                    @click="editor?.chain().focus().toggleBold().run()" title="Negrita">
                    <strong>B</strong>
                  </button>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('italic') }"
                    @click="editor?.chain().focus().toggleItalic().run()" title="Cursiva">
                    <em>I</em>
                  </button>
                  <span class="tool-sep"></span>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('heading', { level: 2 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" title="Título 2">
                    H2
                  </button>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('heading', { level: 3 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" title="Título 3">
                    H3
                  </button>
                  <span class="tool-sep"></span>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('bulletList') }"
                    @click="editor?.chain().focus().toggleBulletList().run()" title="Lista con viñetas">
                    ≡
                  </button>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('orderedList') }"
                    @click="editor?.chain().focus().toggleOrderedList().run()" title="Lista numerada">
                    1.
                  </button>
                  <span class="tool-sep"></span>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('blockquote') }"
                    @click="editor?.chain().focus().toggleBlockquote().run()" title="Cita">
                    "
                  </button>
                  <button type="button" class="tool-btn" :class="{ active: editor?.isActive('code') }"
                    @click="editor?.chain().focus().toggleCode().run()" title="Código">
                    &lt;/&gt;
                  </button>
                  <span class="tool-sep"></span>
                  <button type="button" class="tool-btn"
                    @click="editor?.chain().focus().undo().run()" title="Deshacer">
                    ↩
                  </button>
                  <button type="button" class="tool-btn"
                    @click="editor?.chain().focus().redo().run()" title="Rehacer">
                    ↪
                  </button>
                </div>
                <!-- Área de edición -->
                <EditorContent :editor="editor" class="editor-content" />
              </div>
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
              <small v-if="isCompressing" class="form-help" style="color:#4f46e5">Comprimiendo imagen...</small>
              <div v-if="formData.imageFile && !isCompressing" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <span>{{ formData.imageFile.name }}</span>
              </div>
              <div v-if="editingArticle && editingArticle.imageUrl && !formData.imageFile" class="current-image">
                <p>Imagen actual:</p>
                <img :src="editingArticle.imageUrl" alt="Current" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isSubmitting || isUploading || isCompressing">
                <span v-if="isCompressing">Comprimiendo imagen...</span>
                <span v-else-if="isUploading">Subiendo imagen... {{ uploadProgress }}%</span>
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

            <p v-if="submitError" class="error-message" role="alert" aria-live="assertive">{{ submitError }}</p>
            <p v-if="submitSuccess" class="success-message" role="status" aria-live="polite">{{ submitSuccess }}</p>
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
      </div><!-- fin tab artículos -->

      <!-- ===== TAB PROVINCIAS ===== -->
      <div v-if="activeTab === 'provinces'" class="admin-content">
        <main class="admin-main">
          <h2>{{ editingProvince ? 'Editar Provincia' : 'Nueva Provincia' }}</h2>
          <form @submit.prevent="handleProvinceSubmit" class="article-form">
            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="provinceForm.name" type="text" class="form-input" placeholder="Nombre de la provincia" required />
            </div>
            <div class="form-group">
              <label>Icono (emoji)</label>
              <input v-model="provinceForm.icon" type="text" class="form-input" placeholder="Ej: 🏝️" />
            </div>
            <div class="form-group">
              <label>Foto de portada</label>
              <input type="file" accept=".jpg,.jpeg,.png" @change="handleProvinceImageChange" class="form-input" />
              <small class="form-help">Solo .jpg, .jpeg, .png</small>
              <div v-if="provinceImagePreview" class="image-preview">
                <img :src="provinceImagePreview" alt="Preview" />
              </div>
              <div v-else-if="editingProvince?.imageUrl" class="current-image">
                <p>Imagen actual:</p>
                <img :src="editingProvince.imageUrl" alt="Actual" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="provinceSubmitting">
                {{ provinceSubmitting ? 'Guardando...' : (editingProvince ? 'Actualizar' : 'Crear') }}
              </button>
              <button v-if="editingProvince" type="button" class="btn-secondary" @click="cancelProvinceEdit">Cancelar</button>
            </div>
            <p v-if="provinceError" class="error-message" role="alert" aria-live="assertive">{{ provinceError }}</p>
            <p v-if="provinceSuccess" class="success-message" role="status" aria-live="polite">{{ provinceSuccess }}</p>
          </form>
        </main>

        <aside class="admin-aside">
          <h2>Provincias</h2>
          <div class="articles-list">
            <div v-if="loadingProvinces" class="loading">Cargando...</div>
            <div v-else-if="adminProvinces.length === 0" class="no-articles">
              No hay provincias en Firestore.<br/>
              <button class="btn-secondary" style="margin-top:1rem" @click="seedProvinces">Importar provincias por defecto</button>
            </div>
            <div
              v-else
              v-for="prov in adminProvinces"
              :key="prov.id"
              class="article-item"
              :class="{ active: editingProvince?.id === prov.id }"
            >
              <div class="article-item-content">
                <h3>{{ prov.icon }} {{ prov.name }}</h3>
                <div v-if="prov.imageUrl" class="article-thumbnail">
                  <img :src="prov.imageUrl" :alt="prov.name" />
                </div>
              </div>
              <div class="article-actions">
                <button @click="startProvinceEdit(prov)" class="btn-edit">Editar</button>
                <button @click="confirmProvinceDelete(prov)" class="btn-delete">Eliminar</button>
              </div>
            </div>
          </div>
        </aside>
      </div><!-- fin tab provincias -->

      <!-- ===== TAB EVENTOS ===== -->
      <div v-if="activeTab === 'events'" class="admin-content">
        <main class="admin-main">
          <h2>{{ editingEvent ? 'Editar Evento' : 'Nuevo Evento' }}</h2>
          <form @submit.prevent="handleEventSubmit" class="article-form">
            <div class="form-group">
              <label>Título *</label>
              <input v-model="eventForm.title" type="text" class="form-input" placeholder="Título del evento" required />
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="eventForm.category" class="form-select" required>
                <option value="">Selecciona una categoría</option>
                <option value="musical">🎵 Musicales</option>
                <option value="artistico">🎨 Artísticos</option>
                <option value="gastronomico">🍽️ Gastronómicos</option>
                <option value="deportivo">⚽ Deportivos</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <input v-model="eventForm.date" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label>Descripción breve</label>
              <textarea v-model="eventForm.excerpt" class="form-textarea" rows="3" placeholder="Descripción corta del evento"></textarea>
            </div>
            <div class="form-group">
              <label>Foto</label>
              <input type="file" accept=".jpg,.jpeg,.png" @change="handleEventImageChange" class="form-input" />
              <small class="form-help">Solo .jpg, .jpeg, .png</small>
              <div v-if="eventImagePreview" class="image-preview">
                <img :src="eventImagePreview" alt="Preview" />
              </div>
              <div v-else-if="editingEvent?.imageUrl" class="current-image">
                <p>Imagen actual:</p>
                <img :src="editingEvent.imageUrl" alt="Actual" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="eventSubmitting">
                {{ eventSubmitting ? 'Guardando...' : (editingEvent ? 'Actualizar' : 'Crear') }}
              </button>
              <button v-if="editingEvent" type="button" class="btn-secondary" @click="cancelEventEdit">Cancelar</button>
            </div>
            <p v-if="eventError" class="error-message" role="alert" aria-live="assertive">{{ eventError }}</p>
            <p v-if="eventSuccess" class="success-message" role="status" aria-live="polite">{{ eventSuccess }}</p>
          </form>
        </main>

        <aside class="admin-aside">
          <h2>Eventos</h2>
          <div class="articles-list">
            <div v-if="loadingEvents" class="loading">Cargando...</div>
            <div v-else-if="adminEvents.length === 0" class="no-articles">
              No hay eventos aún.<br/>
              <button class="btn-secondary" style="margin-top:1rem" :disabled="seedingEvents" @click="seedEvents">
                {{ seedingEvents ? 'Creando eventos...' : 'Crear eventos de prueba' }}
              </button>
            </div>
            <div
              v-else
              v-for="ev in adminEvents"
              :key="ev.id"
              class="article-item"
              :class="{ active: editingEvent?.id === ev.id }"
            >
              <div class="article-item-content">
                <h3>{{ ev.title }}</h3>
                <p class="article-meta">
                  <span v-if="ev.category" class="category-badge" :class="ev.category">{{ ev.category }}</span>
                  <span class="date">{{ ev.date }}</span>
                </p>
                <div v-if="ev.imageUrl" class="article-thumbnail">
                  <img :src="ev.imageUrl" :alt="ev.title" />
                </div>
              </div>
              <div class="article-actions">
                <button @click="startEventEdit(ev)" class="btn-edit">Editar</button>
                <button @click="confirmEventDelete(ev)" class="btn-delete">Eliminar</button>
              </div>
            </div>
          </div>
        </aside>
      </div><!-- fin tab eventos -->

    </div><!-- fin admin-panel -->

    <!-- Modal eliminar artículo -->
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

    <!-- Modal eliminar provincia -->
    <div v-if="provinceToDelete" class="modal-overlay" @click="provinceToDelete = null">
      <div class="modal-content" @click.stop>
        <h3>¿Eliminar provincia?</h3>
        <p>¿Seguro que quieres eliminar "{{ provinceToDelete.name }}"?</p>
        <div class="modal-actions">
          <button @click="handleProvinceDelete" class="btn-delete">Eliminar</button>
          <button @click="provinceToDelete = null" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal eliminar evento -->
    <div v-if="eventToDelete" class="modal-overlay" @click="eventToDelete = null">
      <div class="modal-content" @click.stop>
        <h3>¿Eliminar evento?</h3>
        <p>¿Seguro que quieres eliminar "{{ eventToDelete.title }}"?</p>
        <div class="modal-actions">
          <button @click="handleEventDelete" class="btn-delete">Eliminar</button>
          <button @click="eventToDelete = null" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import imageCompression from 'browser-image-compression'
import {
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  type ArticleFormData
} from '../services/articleService'
import type { Article } from '../services/articleService'
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  type FirestoreEvent,
  type EventFormData
} from '../services/eventService'
import {
  createProvince,
  getAllProvinces,
  updateProvince,
  deleteProvince,
  type FirestoreProvince,
  type ProvinceFormData
} from '../services/provinceService'

const ADMIN_PASSWORD = 'admin'

// --- Tab activo ---
const activeTab = ref<'articles' | 'provinces' | 'events'>('articles')

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

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Escribe el contenido del artículo aquí...' })
  ],
  content: '',
  onUpdate({ editor: e }) {
    formData.content = e.getHTML()
  }
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

const imagePreview = ref('')
const isCompressing = ref(false)

watch(
  () => formData.imageFile,
  (newFile, _oldFile) => {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = newFile ? URL.createObjectURL(newFile) : ''
  }
)

// El cleanup de imagePreview se hace en el onUnmounted de abajo junto con los demás

const handleLogin = () => {
  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    password.value = ''
    loginError.value = ''
    sessionStorage.setItem('admin_authenticated', 'true')
    loadArticles()
    loadProvinces()
    loadEvents()
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

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validTypes.includes(file.type)) {
    alert('Solo se permiten archivos .jpg, .jpeg o .png')
    target.value = ''
    return
  }

  isCompressing.value = true
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    })
    formData.imageFile = new File([compressed], file.name, { type: file.type })
  } catch {
    formData.imageFile = file
  } finally {
    isCompressing.value = false
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
  editor.value?.commands.setContent('')
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
  editor.value?.commands.setContent(article.content || '')

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

// =================== PROVINCIAS ===================
const adminProvinces = ref<FirestoreProvince[]>([])
const loadingProvinces = ref(false)
const editingProvince = ref<FirestoreProvince | null>(null)
const provinceToDelete = ref<FirestoreProvince | null>(null)
const provinceSubmitting = ref(false)
const provinceError = ref('')
const provinceSuccess = ref('')
const provinceForm = reactive<ProvinceFormData>({ name: '', icon: '', imageFile: undefined, imageUrl: '' })
const provinceImageFile = ref<File | undefined>()
const provinceImagePreview = ref('')

watch(provinceImageFile, (newFile) => {
  if (provinceImagePreview.value) URL.revokeObjectURL(provinceImagePreview.value)
  provinceImagePreview.value = newFile ? URL.createObjectURL(newFile) : ''
})

const handleProvinceImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    provinceImageFile.value = file
    provinceForm.imageFile = file
  }
}

const loadProvinces = async () => {
  loadingProvinces.value = true
  try { adminProvinces.value = await getAllProvinces() }
  catch (e) { console.error(e) }
  finally { loadingProvinces.value = false }
}

const startProvinceEdit = (prov: FirestoreProvince) => {
  editingProvince.value = prov
  provinceForm.name = prov.name
  provinceForm.icon = prov.icon
  provinceForm.imageUrl = prov.imageUrl ?? ''
  provinceForm.imageFile = undefined
  provinceImageFile.value = undefined
  provinceError.value = ''
  provinceSuccess.value = ''
}

const cancelProvinceEdit = () => {
  editingProvince.value = null
  provinceForm.name = ''
  provinceForm.icon = ''
  provinceForm.imageUrl = ''
  provinceForm.imageFile = undefined
  provinceImageFile.value = undefined
  provinceError.value = ''
  provinceSuccess.value = ''
}

const handleProvinceSubmit = async () => {
  provinceSubmitting.value = true
  provinceError.value = ''
  provinceSuccess.value = ''
  try {
    if (editingProvince.value) {
      await updateProvince(editingProvince.value.id, provinceForm)
      provinceSuccess.value = 'Provincia actualizada'
    } else {
      await createProvince({ ...provinceForm, order: adminProvinces.value.length })
      provinceSuccess.value = 'Provincia creada'
    }
    cancelProvinceEdit()
    await loadProvinces()
    setTimeout(() => { provinceSuccess.value = '' }, 3000)
  } catch (e: any) {
    provinceError.value = `Error: ${e.message ?? 'desconocido'}`
  } finally {
    provinceSubmitting.value = false
  }
}

const confirmProvinceDelete = (prov: FirestoreProvince) => { provinceToDelete.value = prov }

const handleProvinceDelete = async () => {
  if (!provinceToDelete.value) return
  try {
    await deleteProvince(provinceToDelete.value.id)
    provinceToDelete.value = null
    await loadProvinces()
  } catch (e) { console.error(e) }
}

const DEFAULT_PROVINCES = [
  { name: 'Annobón', icon: '🏝️', imageUrl: '', order: 0 },
  { name: 'Bioko Norte', icon: '🏔️', imageUrl: '', order: 1 },
  { name: 'Bioko Sur', icon: '🌊', imageUrl: '', order: 2 },
  { name: 'Centro Sur', icon: '🌳', imageUrl: '', order: 3 },
  { name: 'Kié-Ntem', icon: '🌿', imageUrl: '', order: 4 },
  { name: 'Litoral', icon: '🏖️', imageUrl: '', order: 5 },
  { name: 'Wele-Nzas', icon: '🌲', imageUrl: '', order: 6 },
  { name: 'Djihibilo', icon: '🌄', imageUrl: '', order: 7 }
]

const seedProvinces = async () => {
  loadingProvinces.value = true
  try {
    for (const p of DEFAULT_PROVINCES) {
      await createProvince(p)
    }
    await loadProvinces()
  } catch (e) { console.error(e) }
  finally { loadingProvinces.value = false }
}

// =================== EVENTOS ===================
const adminEvents = ref<FirestoreEvent[]>([])
const loadingEvents = ref(false)
const editingEvent = ref<FirestoreEvent | null>(null)
const eventToDelete = ref<FirestoreEvent | null>(null)
const eventSubmitting = ref(false)
const eventError = ref('')
const eventSuccess = ref('')
const eventForm = reactive<EventFormData>({
  title: '',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  category: 'musical',
  imageFile: undefined,
  imageUrl: ''
})
const eventImageFile = ref<File | undefined>()
const eventImagePreview = ref('')

watch(eventImageFile, (newFile) => {
  if (eventImagePreview.value) URL.revokeObjectURL(eventImagePreview.value)
  eventImagePreview.value = newFile ? URL.createObjectURL(newFile) : ''
})

const handleEventImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    eventImageFile.value = file
    eventForm.imageFile = file
  }
}

const loadEvents = async () => {
  loadingEvents.value = true
  try { adminEvents.value = await getAllEvents() }
  catch (e) { console.error(e) }
  finally { loadingEvents.value = false }
}

const startEventEdit = (ev: FirestoreEvent) => {
  editingEvent.value = ev
  eventForm.title = ev.title
  eventForm.date = ev.date
  eventForm.excerpt = ev.excerpt
  eventForm.category = ev.category ?? 'musical'
  eventForm.imageUrl = ev.imageUrl
  eventForm.imageFile = undefined
  eventImageFile.value = undefined
  eventError.value = ''
  eventSuccess.value = ''
}

const cancelEventEdit = () => {
  editingEvent.value = null
  eventForm.title = ''
  eventForm.date = new Date().toISOString().split('T')[0]
  eventForm.excerpt = ''
  eventForm.category = 'musical'
  eventForm.imageUrl = ''
  eventForm.imageFile = undefined
  eventImageFile.value = undefined
  eventError.value = ''
  eventSuccess.value = ''
}

const handleEventSubmit = async () => {
  eventSubmitting.value = true
  eventError.value = ''
  eventSuccess.value = ''
  try {
    if (editingEvent.value) {
      await updateEvent(editingEvent.value.id, eventForm)
      eventSuccess.value = 'Evento actualizado'
    } else {
      await createEvent(eventForm)
      eventSuccess.value = 'Evento creado'
    }
    cancelEventEdit()
    await loadEvents()
    setTimeout(() => { eventSuccess.value = '' }, 3000)
  } catch (e: any) {
    eventError.value = `Error: ${e.message ?? 'desconocido'}`
  } finally {
    eventSubmitting.value = false
  }
}

const confirmEventDelete = (ev: FirestoreEvent) => { eventToDelete.value = ev }

const handleEventDelete = async () => {
  if (!eventToDelete.value) return
  try {
    await deleteEvent(eventToDelete.value.id)
    eventToDelete.value = null
    await loadEvents()
  } catch (e) { console.error(e) }
}

const seedingEvents = ref(false)

const SEED_EVENTS: EventFormData[] = [
  {
    title: 'Festival de Música Tradicional de Malabo',
    category: 'musical',
    date: '2026-08-15',
    excerpt: 'Gran festival de música y danza tradicional bubi y fang en el centro de Malabo. Artistas de todas las provincias.',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Exposición de Arte Contemporáneo Ecuatoguineano',
    category: 'artistico',
    date: '2026-09-05',
    excerpt: 'Pintores y escultores locales presentan sus obras en el Centro Cultural Hispano-Guineano de Bata.',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Feria Gastronómica Nacional',
    category: 'gastronomico',
    date: '2026-10-01',
    excerpt: 'Degustación de platos típicos de todas las regiones del país. Sopa de pescado, malanga, puerco con arroz y mucho más.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Torneo Nacional de Fútbol Sub-21',
    category: 'deportivo',
    date: '2026-11-10',
    excerpt: 'Equipos juveniles de las 8 provincias se enfrentan en el Estadio de Malabo por el título nacional.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'
  }
]

const seedEvents = async () => {
  seedingEvents.value = true
  try {
    for (const ev of SEED_EVENTS) {
      await createEvent(ev)
    }
    await loadEvents()
    eventSuccess.value = 'Eventos de prueba creados correctamente'
    setTimeout(() => { eventSuccess.value = '' }, 3000)
  } catch (e: any) {
    eventError.value = `Error al crear eventos: ${e.message ?? 'desconocido'}`
  } finally {
    seedingEvents.value = false
  }
}


onUnmounted(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  if (provinceImagePreview.value) URL.revokeObjectURL(provinceImagePreview.value)
  if (eventImagePreview.value) URL.revokeObjectURL(eventImagePreview.value)
  editor.value?.destroy()
})

onMounted(() => {
  const storedAuth = sessionStorage.getItem('admin_authenticated')
  if (storedAuth === 'true') {
    isAuthenticated.value = true
    loadArticles()
    loadProvinces()
    loadEvents()
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

/* Rich text editor */
.editor-wrapper {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.editor-wrapper:focus-within {
  border-color: #4f46e5;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  background: #f1f5f9;
  flex-wrap: wrap;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: #475569;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  font-family: inherit;
}

.tool-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.tool-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.tool-sep {
  width: 1px;
  height: 1.25rem;
  background: rgba(148, 163, 184, 0.5);
  margin: 0 0.25rem;
  flex-shrink: 0;
}

.editor-content {
  min-height: 220px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #1e293b;
  cursor: text;
}

.editor-content :deep(.tiptap) {
  min-height: 200px;
  outline: none;
}

.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
  float: left;
  height: 0;
}

.editor-content :deep(h2) { font-size: 1.4rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #1e293b; }
.editor-content :deep(h3) { font-size: 1.15rem; font-weight: 700; margin: 0.75rem 0 0.4rem; color: #1e293b; }
.editor-content :deep(p)  { margin: 0.5rem 0; }
.editor-content :deep(ul),
.editor-content :deep(ol) { padding-left: 1.5rem; margin: 0.5rem 0; }
.editor-content :deep(ul) { list-style: disc; }
.editor-content :deep(ol) { list-style: decimal; }
.editor-content :deep(li) { margin: 0.25rem 0; }
.editor-content :deep(strong) { font-weight: 700; }
.editor-content :deep(em) { font-style: italic; }
.editor-content :deep(blockquote) {
  border-left: 3px solid #4f46e5;
  margin: 0.5rem 0;
  padding: 0.25rem 1rem;
  color: #64748b;
  font-style: italic;
}
.editor-content :deep(code) {
  background: #e8f0fe;
  color: #4f46e5;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: monospace;
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

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.tab-btn.active {
  background: white;
  color: #0f172a;
  border-color: white;
}
</style>
