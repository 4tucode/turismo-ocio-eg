
<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <RouterLink to="/" class="logo">
          <img :src="logoImage" alt="Turismo y ocio EG" class="logo-img" />
        </RouterLink>
        <div class="nav-links">
          <RouterLink to="/">Inicio</RouterLink>
          <RouterLink to="/cultura">Cultura e Historia</RouterLink>
          <RouterLink to="/#provincias">Provincias</RouterLink>
          <RouterLink to="/#eventos">Eventos</RouterLink>
          <RouterLink to="/about">Acerca de</RouterLink>
        </div>
      </nav>
    </header>
    
    <main class="main">
      <RouterView />
    </main>
    
    <footer class="footer" :style="{ backgroundImage: `url(${bgFooterImage})` }">
      <div class="footer-content">
        <div class="footer-section">
          <img :src="logoConFondoImage" alt="Turismo y ocio EG" class="footer-logo" />
          <p>Descubre Guinea Ecuatorial - Cultura, Naturaleza y Tradición</p>
        </div>
        
        <div class="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><RouterLink to="/">Inicio</RouterLink></li>
            <li><RouterLink to="/about">Acerca de</RouterLink></li>
            <li><RouterLink to="/hospedaje">Hospedaje</RouterLink></li>
            <li><RouterLink to="/transporte">Transporte</RouterLink></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Síguenos</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Blog de Silvia. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import logoImage from './assets/logo-sin-fondo.png'
import logoConFondoImage from './assets/loggo con fondo.jpeg'
import bgFooterImage from './assets/bg-footer.png'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: transparent;
  color: white;
  padding: 1rem 0;
  box-shadow: none;
  position: absolute;
  width: 100%;
  z-index: 10;
  top: 0;
  left: 0;
}

.nav {
  /* max-width: 1200px; */
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100px;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
}

.logo-img {
  height: 100px;
  width: auto;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
}

.main {
  flex: 1;
  width: 100%;
  padding: 0;
  background-color: #fff8f0;
  position: relative;
  z-index: 5;
}

.footer {
  background-color: #f5e6d3;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #6b4423;
  margin-top: 4rem;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  color: #8b5a3c;
}

.footer-logo {
  max-width: 200px;
  height: auto;
  margin-bottom: 1rem;
  display: block;
}

.footer-section p {
  color: #6b4423;
  line-height: 1.6;
  opacity: 0.9;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section ul li a {
  color: #6b4423;
  text-decoration: none;
  transition: color 0.3s;
  opacity: 0.9;
}

.footer-section ul li a:hover {
  color: #c97a54;
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #6b4423;
  transition: color 0.3s, transform 0.3s;
  display: inline-block;
  opacity: 0.9;
}

.social-links a:hover {
  color: #c97a54;
  transform: translateY(-3px);
  opacity: 1;
}

.footer-bottom {
  border-top: 1px solid rgba(107, 68, 35, 0.2);
  padding: 1.5rem;
  text-align: center;
}

.footer-bottom p {
  color: #6b4423;
  font-size: 0.875rem;
  opacity: 0.7;
}

@media (max-width: 1024px) {
  .logo {
    height: 90px;
  }
  
  .logo-img {
    height: 90px;
  }
  
  .nav-links {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem 0;
  }
  
  .nav {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .logo {
    height: 70px;
  }
  
  .logo-img {
    height: 70px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.5rem 0;
  }
  
  .nav {
    padding: 0 0.75rem;
  }
  
  .logo {
    height: 60px;
  }
  
  .logo-img {
    height: 60px;
  }
  
  .nav-links {
    gap: 0.5rem;
    font-size: 0.8rem;
  }
  
  .nav-links a {
    padding: 0.25rem 0.5rem;
  }
}
</style>

