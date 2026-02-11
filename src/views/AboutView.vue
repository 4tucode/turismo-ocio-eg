<template>
  <div class="about">
    <div class="about-hero">
      <div class="about-hero-content">
        <p class="about-eyebrow">Sobre la autora</p>
        <h1>Acerca de Silvia</h1>
        <p class="about-lead">
          Periodista y narradora de viajes. Aquí convierto historias locales en rutas,
          experiencias y recomendaciones que te acercan a Guinea Ecuatorial con mirada
          auténtica.
        </p>
      </div>
      <div class="about-hero-card">
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?name=Silvia&size=200&background=667eea&color=fff" alt="Silvia" />
        </div>
        <div class="profile-info">
          <h2>Silvia</h2>
          <p class="subtitle">Periodista · Cultura y turismo</p>
        </div>
      </div>
    </div>
    
    <div class="about-content">
      <div class="about-grid">
        <section class="about-card">
          <h3>Quién es Silvia</h3>
          <p>
            Soy Silvia, una entusiasta de las historias que conectan personas y lugares.
            Mi formación en Periodismo me dio las herramientas para investigar, escuchar
            y contar con rigor lo que hace especial cada destino.
          </p>
        </section>

        <section class="about-card">
          <h3>Qué ofrece el blog</h3>
          <p>
            En este rincón digital no solo encontrarás guías de destinos. Mi objetivo es
            ayudarte a planificar tu viaje con confianza, con datos reales, cultura viva y
            recomendaciones locales.
          </p>
        </section>

        <section class="about-card">
          <h3>Un toque personal</h3>
          <p>
            Cuando no estoy escribiendo aquí o editando fotos, probablemente me encuentres
            paseando por mercados, conversando con artesanos o buscando el café perfecto.
          </p>
        </section>

        <section class="about-card highlight">
          <h3>Llamada a la acción</h3>
          <p>
            ¿Te unes a la aventura? No te pierdas nada y acompáñame en cada ruta, historia
            y descubrimiento.
          </p>
          <RouterLink to="/" class="cta-button">Explorar el blog</RouterLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding: 130px 2rem 3rem;
  background: #454545;
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 3rem;
}

.about-hero-content {
  padding: 0;
}

.about-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.about-hero-content h1 {
  font-size: 3rem;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

.about-lead {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0;
}

.about-hero-card {
  text-align: center;
}

.avatar {
  width: 160px;
  height: 160px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: 1.6rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
}

.about-content {
  padding: 0;
  margin-top: 2.5rem;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.about-card {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.about-card h3 {
  color: #ffffff;
  margin: 0 0 1rem 0;
  font-size: 1.35rem;
}

.about-card p {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0;
}

.about-card.highlight {
  background: transparent;
  border: none;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  color: #1f2937;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(31, 41, 55, 0.25);
}

@media (max-width: 900px) {
  .about-hero {
    grid-template-columns: 1fr;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 120px 1rem 2rem;
  }

  .about-hero-content h1 {
    font-size: 2.3rem;
  }

  .about-content {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .about-hero-content h1 {
    font-size: 2rem;
  }

  .about-lead {
    font-size: 1.05rem;
  }

  .about-card h3 {
    font-size: 1.2rem;
  }
}
</style>

