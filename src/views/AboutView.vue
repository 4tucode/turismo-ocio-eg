<template>
  <div class="about">
    <div class="about-header">
      <h1>Acerca de</h1>
    </div>
    
    <div class="about-content">
      <div class="profile">
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?name=Silvia&size=200&background=667eea&color=fff" alt="Silvia" />
        </div>
        <h2>Silvia</h2>
        <p class="subtitle">Desarrolladora y Blogger</p>
      </div>
      
      <div class="bio">
        <h3>¡Hola! 👋</h3>
        <p>
          Soy Silvia, una apasionada del desarrollo web y la tecnología. 
          Este blog es mi espacio personal donde comparto mis experiencias, 
          aprendizajes y reflexiones sobre programación, desarrollo web y tecnología en general.
        </p>
        <p>
          Me especializo en el desarrollo frontend con Vue.js, TypeScript y otras 
          tecnologías modernas. Me encanta aprender cosas nuevas y compartir 
          conocimientos con la comunidad.
        </p>
        <p>
          Cuando no estoy programando, me gusta leer, viajar y explorar nuevas tecnologías 
          que puedan mejorar mi trabajo y el de otros desarrolladores.
        </p>
        
        <h3>Tecnologías que uso</h3>
        <div class="tech-stack">
          <span class="tech">Vue.js</span>
          <span class="tech">TypeScript</span>
          <span class="tech">JavaScript</span>
          <span class="tech">HTML/CSS</span>
          <span class="tech">Node.js</span>
          <span class="tech">Git</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
}

.about-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #667eea;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  font-size: 1.125rem;
}

.bio h3 {
  color: #2c3e50;
  margin: 2rem 0 1rem 0;
}

.bio p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tech {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }
  
  .about-content {
    padding: 1.5rem;
  }
}
</style>

