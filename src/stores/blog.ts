import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post, Sponsor, Event, Province, Banner, Slide, Service, CulturaArticle, ProvinceInfo } from '../types/blog'
import { subscribeEvents } from '../services/eventService'
import { subscribeProvinces } from '../services/provinceService'

export const useBlogStore = defineStore('blog', () => {
  // Banner publicitario
  const banners = ref<Banner[]>([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
      link: '#',
      alt: 'Publicidad principal'
    }
  ])

  // Slides de portada
  const slides = ref<Slide[]>([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200&auto=format&fit=crop&q=80',
      title: 'Descubre Guinea Ecuatorial',
      subtitle: 'El corazón de África Central',
      link: '/about'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&auto=format&fit=crop&q=80',
      title: 'Cultura y Tradición',
      subtitle: 'Un legado ancestral vivo',
      link: '/post/cultura-guinea'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&auto=format&fit=crop&q=80',
      title: 'Naturaleza Exuberante',
      subtitle: 'Biodiversidad única en el mundo',
      link: '/post/naturaleza-guinea'
    }
  ])

  // Posts del blog
  const posts = ref<Post[]>([
    // Cultura e Historia
    {
      id: 1,
      title: 'La Casa Verde de Bioko: Un tesoro arquitectónico del siglo XIX',
      slug: 'casa-verde-bioko',
      excerpt: 'Descubre la fascinante historia de La Casa Verde, un edificio colonial prefabricado en Bélgica y ensamblado en la isla de Bioko, símbolo de la arquitectura colonial única de Guinea Ecuatorial.',
      content: `<h1>La Casa Verde de Bioko: Un tesoro arquitectónico del siglo XIX</h1>
        <h2>Un edificio único en el corazón de Bioko</h2>
        <p>La Casa Verde es uno de los edificios más emblemáticos y fotografiados de la isla de Bioko, en Guinea Ecuatorial. Esta estructura colonial del siglo XIX representa una pieza única de arquitectura prefabricada que cuenta una historia fascinante de ingeniería, comercio y adaptación cultural.</p>
        <h2>Origen e historia</h2>
        <p>Lo que hace a La Casa Verde verdaderamente especial es su origen: fue prefabricada en Bélgica durante el siglo XIX y posteriormente transportada y ensamblada en la isla de Bioko. Este método de construcción, inusual para la época, refleja las innovaciones arquitectónicas de la era colonial y la necesidad de adaptar estructuras europeas a las condiciones tropicales de África Central.</p>
        <h2>Arquitectura y diseño</h2>
        <p>El edificio, pintado en su característico color verde que le da su nombre, muestra un diseño arquitectónico que combina elementos europeos con adaptaciones para el clima tropical. Su estructura de madera y metal, prefabricada en Europa, fue diseñada para resistir las condiciones climáticas de la isla mientras mantenía la estética colonial de la época.</p>
        <h2>Usos a lo largo de la historia</h2>
        <p>A lo largo de sus más de cien años de existencia, La Casa Verde ha servido diversos propósitos, adaptándose a las necesidades cambiantes de la isla. Desde su función original hasta sus usos actuales, el edificio ha sido testigo de la evolución histórica de Bioko y de Guinea Ecuatorial.</p>
        <h2>Patrimonio cultural</h2>
        <p>Hoy en día, La Casa Verde es reconocida como un importante atractivo histórico y arquitectónico. Representa no solo un ejemplo único de arquitectura prefabricada colonial, sino también un símbolo de la rica historia de la isla de Bioko y su papel como punto de encuentro entre África y Europa.</p>
        <h2>Visita y contemplación</h2>
        <p>Para los visitantes interesados en la historia y la arquitectura, La Casa Verde ofrece una oportunidad única de contemplar un edificio que narra más de un siglo de historia. Su presencia en el paisaje de Bioko Norte es un recordatorio constante de las complejas relaciones históricas y culturales que han moldeado Guinea Ecuatorial.</p>
        <p>Este edificio no es solo una estructura física, sino un testimonio vivo de la ingeniería colonial, la adaptación arquitectónica y la historia compartida entre continentes.</p>`,
      author: 'Silvia',
      date: '2025-01-15',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
      tags: ['cultura', 'historia', 'arquitectura', 'bioko'],
      category: 'cultura',
      featured: true
    },
    {
      id: 2,
      title: 'Fiestas tradicionales y ceremonias ancestrales',
      slug: 'fiestas-tradicionales',
      excerpt: 'Las celebraciones que mantienen vivas nuestras raíces.',
      content: '<h2>Fiestas Tradicionales</h2><p>Las ceremonias ancestrales son parte fundamental...</p>',
      author: 'Silvia',
      date: '2025-10-06',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
      tags: ['cultura', 'fiestas'],
      category: 'cultura'
    },
    {
      id: 11,
      title: 'Arte y artesanía tradicional ecuatoguineana',
      slug: 'arte-artesania-tradicional',
      excerpt: 'Descubre el talento artesanal de nuestros maestros artesanos.',
      content: '<h2>Arte Tradicional</h2><p>La artesanía ecuatoguineana refleja siglos de tradición...</p>',
      author: 'Silvia',
      date: '2025-10-04',
      imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop&q=80',
      tags: ['cultura', 'arte', 'artesanía'],
      category: 'cultura'
    },
    // Naturaleza y Aventura
    {
      id: 3,
      title: 'La biodiversidad única de Bioko: Especies endémicas y ecosistemas únicos',
      slug: 'biodiversidad-bioko',
      excerpt: 'La isla de Bioko alberga una de las biodiversidades más ricas y únicas del Golfo de Guinea, con especies endémicas que no se encuentran en ningún otro lugar del mundo.',
      content: `<h1>La biodiversidad única de Bioko: Especies endémicas y ecosistemas únicos</h1>
        <h2>Un tesoro natural en el Golfo de Guinea</h2>
        <p>La isla de Bioko, ubicada en el Golfo de Guinea, es reconocida internacionalmente por su extraordinaria riqueza natural y biodiversidad. Esta isla volcánica, separada del continente africano, ha desarrollado ecosistemas únicos que albergan especies endémicas fascinantes.</p>
        <h2>Ecosistemas diversos</h2>
        <p>Bioko presenta una variedad impresionante de ecosistemas: desde las playas de arena negra volcánica hasta las cumbres del Pico Basile a más de 3.000 metros de altura, pasando por densas selvas tropicales y bosques nubosos. Esta diversidad de hábitats ha permitido la evolución de especies únicas.</p>
        <h2>Especies endémicas</h2>
        <p>La isla es hogar de numerosas especies endémicas, incluyendo primates como el dril (Mandrillus leucophaeus), que solo se encuentra en Bioko y algunas áreas de Camerún y Nigeria. Los bosques de Bioko también albergan una gran variedad de aves endémicas, mariposas y plantas que no existen en ningún otro lugar del planeta.</p>
        <h2>Flora única</h2>
        <p>La vegetación de Bioko es igualmente impresionante. Los bosques primarios de la isla contienen especies de árboles centenarios y una gran diversidad de orquídeas y plantas epífitas. Los bosques nubosos en las alturas del Pico Basile crean un ambiente mágico y único.</p>
        <h2>Conservación y ecoturismo</h2>
        <p>La conservación de esta biodiversidad única es fundamental. Los parques nacionales y reservas naturales de Bioko ofrecen oportunidades excepcionales para el ecoturismo responsable, permitiendo a los visitantes observar especies raras en su hábitat natural mientras se contribuye a su protección.</p>
        <h2>Un laboratorio natural</h2>
        <p>Para científicos y naturalistas, Bioko representa un laboratorio natural invaluable. El aislamiento geográfico de la isla ha creado condiciones ideales para estudiar la evolución y la adaptación de especies, proporcionando conocimientos cruciales sobre la biodiversidad tropical.</p>
        <h2>Experiencia única para visitantes</h2>
        <p>Los visitantes de Bioko pueden disfrutar de experiencias únicas: caminatas por senderos que atraviesan selvas primarias, observación de primates en su hábitat natural, avistamiento de aves endémicas, y la oportunidad de contemplar paisajes que combinan el océano Atlántico con montañas volcánicas cubiertas de vegetación exuberante.</p>
        <p>Bioko no es solo una isla: es un santuario de biodiversidad que demuestra la increíble capacidad de la naturaleza para crear vida única y adaptada a condiciones específicas.</p>`,
      author: 'Silvia',
      date: '2025-01-14',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
      tags: ['naturaleza', 'biodiversidad', 'bioko', 'ecoturismo', 'especies endémicas'],
      category: 'naturaleza',
      featured: true
    },
    {
      id: 4,
      title: 'Senderismo en las montañas de Bioko',
      slug: 'senderismo-bioko',
      excerpt: 'Rutas de trekking para aventureros en la isla de Bioko.',
      content: '<h2>Aventura</h2><p>Las montañas de Bioko ofrecen experiencias únicas...</p>',
      author: 'Silvia',
      date: '2025-10-04',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80',
      tags: ['naturaleza', 'aventura', 'montaña'],
      category: 'naturaleza'
    },
    {
      id: 12,
      title: 'Observación de fauna silvestre en Río Muni',
      slug: 'fauna-silvestre-rio-muni',
      excerpt: 'Descubre la increíble diversidad de vida salvaje en la región continental.',
      content: '<h2>Fauna Silvestre</h2><p>Río Muni alberga especies únicas de primates, aves y mamíferos...</p>',
      author: 'Silvia',
      date: '2025-10-03',
      imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&auto=format&fit=crop&q=80',
      tags: ['naturaleza', 'fauna', 'safari'],
      category: 'naturaleza'
    },
    // Gastronomía
    {
      id: 5,
      title: 'Sabores de Guinea Ecuatorial: Un viaje culinario por las etnias',
      slug: 'gastronomia-tradicional-etnias',
      excerpt: 'Descubre la rica gastronomía de Guinea Ecuatorial, una fusión única de sabores africanos donde cada etnia aporta sus platos característicos y tradiciones culinarias ancestrales.',
      content: `<h1>Sabores de Guinea Ecuatorial: Un viaje culinario por las etnias</h1>
        <h2>Una cocina diversa y rica en tradición</h2>
        <p>La gastronomía de Guinea Ecuatorial es un verdadero mosaico culinario que refleja la diversidad étnica del país. Cada grupo étnico aporta sus propias tradiciones culinarias, ingredientes locales y técnicas de preparación, creando una oferta gastronómica única y variada.</p>
        <h2>Los Fang: Mendjaga y Bambucha</h2>
        <p>La etnia fang, una de las más numerosas del país, ofrece platos como el <strong>Mendjaga</strong> o <strong>Bambucha</strong>, una deliciosa fusión de hojas de plantas de tubérculos con palmiste, maíz, malanga, batata y berenjenas verdes. Este plato representa la sabiduría culinaria de combinar ingredientes locales para crear sabores complejos y nutritivos.</p>
        <h2>Los Bubi: Bocaô tradicional</h2>
        <p>Los bubi, habitantes originarios de la isla de Bioko, preparan el <strong>Bocaô</strong>, un plato elaborado con hojas verdes de djakato o boloki, cocinadas con aceite de palma y acompañadas de sardinas o pescado fresco. Este plato refleja la conexión de los bubi con el mar y los recursos naturales de la isla.</p>
        <h2>Los Ndowé: Djoma YaiKai</h2>
        <p>La etnia ndowé, conocida por su relación con la pesca, ofrece el <strong>Djoma YaiKai</strong>, un método único de cocinar pescado sin agua, utilizando su propio jugo y una cantidad significativa de picante. Esta técnica culinaria demuestra la creatividad en la preparación de alimentos y el uso de especias locales.</p>
        <h2>Los Anobonés: Pisho con coco</h2>
        <p>Los habitantes de la isla de Annobón preparan el <strong>Pisho</strong>, una guarnición a base de tubérculos locales mezclados con coco rallado y ligeramente tostados. Este plato refleja la influencia de la isla y su uso creativo del coco, un ingrediente abundante en la región.</p>
        <h2>Los Bisio: Nduka Bisio</h2>
        <p>La etnia bisio ofrece el <strong>Nduka Bisio</strong>, preparado con modica, pescado fresco, sal y picante, ofreciendo un sabor fuerte y característico que representa la preferencia por sabores intensos en la cocina tradicional.</p>
        <h2>Ingredientes comunes</h2>
        <p>A pesar de la diversidad, hay ingredientes que unen toda la gastronomía ecuatoguineana: el aceite de palma, la yuca, el plátano, el pescado fresco, y las especias locales. Estos ingredientes base se combinan de diferentes maneras según la tradición de cada etnia.</p>
        <h2>Una experiencia culinaria única</h2>
        <p>Probar la gastronomía de Guinea Ecuatorial es embarcarse en un viaje sensorial que conecta con la historia, la cultura y la identidad de cada comunidad. Cada plato cuenta una historia, cada sabor transmite tradiciones ancestrales, y cada comida es una celebración de la diversidad cultural del país.</p>
        <p>La gastronomía ecuatoguineana no es solo comida: es patrimonio cultural vivo, transmitido de generación en generación, y una invitación a descubrir los sabores auténticos de África Central.</p>`,
      author: 'Silvia',
      date: '2025-01-13',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      tags: ['gastronomía', 'cocina', 'tradición', 'etnias', 'platos típicos'],
      category: 'gastronomia',
      featured: true
    },
    {
      id: 6,
      title: 'Mercados locales y productos frescos',
      slug: 'mercados-locales',
      excerpt: 'Descubre los mercados tradicionales y sus delicias.',
      content: '<h2>Mercados</h2><p>Los mercados locales son el corazón de la gastronomía...</p>',
      author: 'Silvia',
      date: '2025-10-02',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80',
      tags: ['gastronomía', 'mercados'],
      category: 'gastronomia'
    },
    {
      id: 13,
      title: 'Recetas tradicionales: Cómo preparar pepesoup',
      slug: 'receta-pepesoup',
      excerpt: 'Aprende a cocinar uno de los platos más emblemáticos de Guinea Ecuatorial.',
      content: '<h2>Recetas</h2><p>El pepesoup es un delicioso plato tradicional que combina...</p>',
      author: 'Silvia',
      date: '2025-10-01',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80',
      tags: ['gastronomía', 'recetas', 'cocina'],
      category: 'gastronomia'
    },
    // Ocio
    {
      id: 7,
      title: 'Tradiciones y danzas de Guinea Ecuatorial: El corazón cultural del país',
      slug: 'tradiciones-danzas-guinea-ecuatorial',
      excerpt: 'Explora las fascinantes tradiciones, danzas y expresiones artísticas de las diferentes etnias de Guinea Ecuatorial, desde la danza Kachá de los bubis hasta las esculturas fang.',
      content: `<h1>Tradiciones y danzas de Guinea Ecuatorial: El corazón cultural del país</h1>
        <h2>Un mosaico cultural vibrante</h2>
        <p>Guinea Ecuatorial es un país de extraordinaria diversidad cultural, donde cada etnia mantiene vivas sus tradiciones ancestrales a través de la música, la danza, el arte y las ceremonias. Estas expresiones culturales no son solo entretenimiento, sino la forma en que las comunidades preservan su identidad y transmiten su historia.</p>
        <h2>La danza Kachá de los Bubis</h2>
        <p>Los bubis, habitantes originarios de la isla de Bioko, son conocidos por su danza <strong>Kachá</strong>, una expresión artística que combina canto y relatos de proezas y acontecimientos históricos. Esta danza, acompañada de percusión tradicional, es más que un espectáculo: es una forma de narrar la historia del pueblo bubi, sus hazañas, sus luchas y sus celebraciones.</p>
        <p>La Kachá se interpreta en ceremonias importantes y festividades, donde los danzantes, vestidos con trajes tradicionales, ejecutan movimientos que cuentan historias ancestrales. Los cantos que acompañan la danza son transmitidos oralmente de generación en generación, preservando la memoria colectiva del pueblo.</p>
        <h2>El arte Fang: Esculturas y máscaras rituales</h2>
        <p>La etnia fang es reconocida internacionalmente por su arte, especialmente sus esculturas de madera y máscaras rituales. Estas obras de arte no son meramente decorativas: tienen un profundo significado espiritual y cultural, utilizadas en ceremonias tradicionales y rituales.</p>
        <p>Las esculturas fang, talladas en madera con gran maestría, representan figuras ancestrales, espíritus y símbolos de poder. Las máscaras, por su parte, son utilizadas en danzas rituales y ceremonias de iniciación, cada una con su propio significado y propósito espiritual.</p>
        <h2>Música y percusión tradicional</h2>
        <p>La música tradicional de Guinea Ecuatorial es rica y diversa. Cada etnia tiene sus propios instrumentos, ritmos y estilos musicales. Los instrumentos de percusión, como tambores de diferentes tamaños y formas, son fundamentales en las celebraciones y ceremonias.</p>
        <p>La música no solo acompaña las danzas, sino que también es una forma de comunicación, de expresión emocional y de conexión con lo espiritual. Los ritmos tradicionales se han mantenido vivos a lo largo de los siglos, adaptándose pero conservando su esencia.</p>
        <h2>Ceremonias y rituales</h2>
        <p>Las diferentes etnias de Guinea Ecuatorial realizan diversas ceremonias y rituales que combinan música, danza, arte y espiritualidad. Estas ceremonias marcan momentos importantes de la vida: nacimientos, iniciaciones, matrimonios, y también celebran la naturaleza, las cosechas y los ciclos de la vida.</p>
        <h2>Preservación y evolución</h2>
        <p>En la actualidad, estas tradiciones se mantienen vivas gracias al esfuerzo de las comunidades y a la transmisión de conocimientos de los mayores a los jóvenes. Al mismo tiempo, las tradiciones evolucionan, incorporando elementos modernos mientras preservan su esencia cultural.</p>
        <h2>Experiencia para visitantes</h2>
        <p>Para los visitantes, presenciar estas tradiciones es una oportunidad única de sumergirse en la cultura auténtica de Guinea Ecuatorial. Asistir a una danza tradicional, observar la creación de arte fang, o participar en una ceremonia local, ofrece una conexión profunda con la identidad cultural del país.</p>
        <p>Las tradiciones y danzas de Guinea Ecuatorial son el alma del país: expresiones vivas de historia, identidad y comunidad que continúan inspirando y conectando a las personas con sus raíces ancestrales.</p>`,
      author: 'Silvia',
      date: '2025-01-12',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
      tags: ['cultura', 'tradiciones', 'danzas', 'arte', 'música', 'etnias'],
      category: 'ocio',
      featured: true
    },
    {
      id: 8,
      title: 'Playas paradisíacas: Arena Blanca y más',
      slug: 'playas-guinea',
      excerpt: 'Las mejores playas para relajarte y disfrutar.',
      content: '<h2>Playas</h2><p>Las costas de Guinea Ecuatorial poseen playas...</p>',
      author: 'Silvia',
      date: '2025-09-30',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      tags: ['ocio', 'playas', 'turismo'],
      category: 'ocio'
    },
    {
      id: 14,
      title: 'Deportes acuáticos en las costas ecuatoguineanas',
      slug: 'deportes-acuaticos',
      excerpt: 'Buceo, snorkel y más aventuras en aguas cristalinas.',
      content: '<h2>Deportes Acuáticos</h2><p>Las aguas de Guinea Ecuatorial son perfectas para practicar...</p>',
      author: 'Silvia',
      date: '2025-09-29',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      tags: ['ocio', 'deportes', 'playa'],
      category: 'ocio'
    },
    // Noticias recientes
    {
      id: 9,
      title: 'Nueva ruta turística inaugurada en Bata',
      slug: 'nueva-ruta-bata',
      excerpt: 'El gobierno inaugura un nuevo circuito turístico.',
      content: '<h2>Noticia</h2><p>Se ha inaugurado una nueva ruta...</p>',
      author: 'Silvia',
      date: '2025-10-07',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
      tags: ['noticias', 'turismo'],
      category: 'general'
    },
    {
      id: 10,
      title: 'Festival Cultural 2025 en Malabo',
      slug: 'festival-cultural-2025',
      excerpt: 'El mayor evento cultural del año llega a la capital.',
      content: '<h2>Festival</h2><p>Este año el festival cultural promete...</p>',
      author: 'Silvia',
      date: '2025-10-06',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      tags: ['noticias', 'cultura', 'eventos'],
      category: 'general'
    },
    {
      id: 15,
      title: 'Inversión en infraestructura turística nacional',
      slug: 'inversion-infraestructura-turistica',
      excerpt: 'Nuevo plan de desarrollo busca impulsar el turismo en todo el país.',
      content: '<h2>Desarrollo Turístico</h2><p>El gobierno anuncia importantes inversiones en infraestructura...</p>',
      author: 'Silvia',
      date: '2025-10-05',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      tags: ['noticias', 'turismo', 'desarrollo'],
      category: 'general'
    }
  ])

  // Patrocinadores
  const sponsors = ref<Sponsor[]>([
    {
      id: 1,
      name: 'Sponsor 1',
      logo: 'https://via.placeholder.com/150x80/667eea/ffffff?text=Sponsor+1',
      website: 'https://example.com'
    },
    {
      id: 2,
      name: 'Sponsor 2',
      logo: 'https://via.placeholder.com/150x80/764ba2/ffffff?text=Sponsor+2',
      website: 'https://example.com'
    },
    {
      id: 3,
      name: 'Sponsor 3',
      logo: 'https://via.placeholder.com/150x80/f093fb/ffffff?text=Sponsor+3',
      website: 'https://example.com'
    },
    {
      id: 4,
      name: 'Sponsor 4',
      logo: 'https://via.placeholder.com/150x80/4facfe/ffffff?text=Sponsor+4',
      website: 'https://example.com'
    }
  ])

  // Eventos
  const events = ref<Event[]>([
    {
      id: 1,
      title: 'Musicales',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80',
      slug: 'festival-musica-tradicional',
      date: '2025-11-15',
      excerpt: 'Gran festival de música y danza tradicional en Malabo.'
    },
    {
      id: 2,
      title: 'Artísticos',
      imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
      slug: 'exposicion-arte',
      date: '2025-11-20',
      excerpt: 'Artistas locales exponen sus obras en el Centro Cultural.'
    },
    {
      id: 3,
      title: 'Gastronómicos',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      slug: 'feria-gastronomica',
      date: '2025-12-01',
      excerpt: 'Degustación de platos típicos de todas las regiones.'
    },
    {
      id: 4,
      title: 'Deportivos',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
      slug: 'torneo-deportivo',
      date: '2025-12-10',
      excerpt: 'Competencia deportiva con equipos de todo el país.'
    }
  ])

  // Provincias de Guinea Ecuatorial
  const provinces = ref<Province[]>([
    { id: 1, name: 'Annobón', slug: 'annobon', icon: '🏝️' },
    { id: 2, name: 'Bioko Norte', slug: 'bioko-norte', icon: '🏔️' },
    { id: 3, name: 'Bioko Sur', slug: 'bioko-sur', icon: '🌊' },
    { id: 4, name: 'Centro Sur', slug: 'centro-sur', icon: '🌳' },
    { id: 5, name: 'Kié-Ntem', slug: 'kie-ntem', icon: '🌿' },
    { id: 6, name: 'Litoral', slug: 'litoral', icon: '🏖️' },
    { id: 7, name: 'Wele-Nzas', slug: 'wele-nzas', icon: '🌲' },
    { id: 8, name: 'Djihibilo', slug: 'djihibilo', icon: '🌄' }
  ])

  // Información detallada de provincias
  const provinceInfos = ref<ProvinceInfo[]>([
    {
      id: 1,
      name: 'Annobón',
      slug: 'annobon',
      capital: 'San Antonio de Palé',
      description: 'La isla más remota y paradisíaca de Guinea Ecuatorial, un pequeño paraíso volcánico en medio del océano Atlántico, situada a 350 km del litoral africano de Gabón y a 185 km de Santo Tomé y Príncipe. Aquí la naturaleza virgen y la cultura única se fusionan en perfecta armonía.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Annobon.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Isla volcánica situada a aproximadamente 350 km del litoral africano de Gabón y a 185 km de Santo Tomé y Príncipe, en el océano Atlántico. Es el punto más meridional de Guinea Ecuatorial y la provincia más alejada del continente.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Annobon.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 5,314 habitantes (según datos de 2015) que mantienen tradiciones ancestrales y un estilo de vida en armonía con la naturaleza. Los annoboneses son mayoritariamente pescadores y practican el catolicismo.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Isla de origen volcánico con una superficie de 18 km², 6 km de largo y 3 km de ancho. El punto más alto es el Monte Francos con 598 metros sobre el nivel del mar. La isla cuenta con riachuelos y el lago Mazafim, un cráter volcánico convertido en laguna.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Buceo en aguas cristalinas, senderismo por volcanes extintos, observación de aves endémicas, pesca tradicional, exploración de la laguna Mazafim y relajación en playas vírgenes.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'San Antonio de Palé',
          description: 'La capital de la isla, un pintoresco pueblo costero donde la vida transcurre a un ritmo tranquilo y la hospitalidad es una virtud. Es el principal asentamiento humano de la isla.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        },
        {
          id: 2,
          title: 'Monte Francos',
          description: 'El punto más alto de la isla con 598 metros de altitud, un volcán extinto que ofrece vistas espectaculares de toda la isla y senderos para los amantes del trekking.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        },
        {
          id: 3,
          title: 'Lago Mazafim',
          description: 'Un cráter volcánico convertido en laguna, uno de los atractivos naturales más impresionantes de la isla. Un lugar perfecto para la contemplación y la fotografía.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        },
        {
          id: 4,
          title: 'Cultura Annobonesa',
          description: 'Una cultura única con influencias portuguesas, africanas y criollas, reflejada en su música, danza y gastronomía tradicional. La isla mantiene sus tradiciones ancestrales.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
        }
      ],
      facts: [
        'Annobón es la isla más remota de Guinea Ecuatorial, descubierta por los portugueses el 1 de enero de 1474',
        'Su nombre proviene del portugués "Ano Bom" (Año Bueno), por haber sido descubierta el día de Año Nuevo',
        'La isla tiene una superficie de 18 km² con forma casi circular (6 km de largo por 3 km de ancho)',
        'Es hogar de especies endémicas únicas como el ojo blanco (Zosterops griseoviriscens) y el monarca del paraíso de Annobón (Terpsiphone smithii)',
        'La economía local se basa principalmente en la pesca artesanal y la agricultura de subsistencia',
        'Forma parte de la ecorregión selva de tierras bajas de Santo Tomé, Príncipe y Annobón, con flora única que incluye baobabs y ceibas'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/Annobon.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/600px-Annobon.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/Annobon.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Annobon.jpg/800px-Annobon.jpg'
      ]
    },
    {
      id: 2,
      name: 'Bioko Norte',
      slug: 'bioko-norte',
      capital: 'Malabo',
      description: 'Ubicada en la parte septentrional de la isla de Bioko, Bioko Norte alberga la capital nacional, Malabo. Con una superficie de 776 km² y más de 300,000 habitantes, es una provincia rica en biodiversidad, arquitectura colonial y vida urbana vibrante.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Malabo.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Situada en la parte septentrional de la isla de Bioko, en la región insular de Guinea Ecuatorial. Limita al sur con Bioko Sur y está rodeada por el golfo de Guinea en sus demás fronteras.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 300,374 habitantes (2015), siendo una de las provincias más pobladas. Malabo concentra gran parte de la población y es el principal centro económico del país.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 3,
          title: 'Clima',
          content: 'Clima tropical húmedo con temperaturas estables durante todo el año. Temporada seca de diciembre a febrero y temporada de lluvias de marzo a noviembre. La humedad es alta durante todo el año.',
          icon: '🌤️',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Exploración de la arquitectura colonial, visitas al Pico Basile, ecoturismo en reservas naturales, buceo, vida nocturna en Malabo y degustación de gastronomía local e internacional.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Malabo',
          description: 'La capital nacional de Guinea Ecuatorial, conocida por su arquitectura colonial española, el puerto comercial más importante del país y su vida cultural vibrante.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 2,
          title: 'Pico Basile',
          description: 'El punto más alto de la isla de Bioko con 3,011 metros de altitud, ideal para senderismo y observación de aves endémicas. Ofrece vistas espectaculares de toda la isla.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 3,
          title: 'Reserva Científica de la Caldera de Luba',
          description: 'Una de las reservas naturales más importantes, hogar de especies endémicas únicas, incluyendo primates raros y una flora exuberante de selva tropical.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        },
        {
          id: 4,
          title: 'Playa de Arena Blanca',
          description: 'Hermosas playas con arenas volcánicas negras y blancas que ofrecen oportunidades para relajación, buceo y observación de tortugas marinas.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
        }
      ],
      facts: [
        'Malabo fue fundada en 1827 como Port Clarence por los británicos',
        'La provincia alberga el Aeropuerto Internacional de Malabo, el principal del país',
        'Bioko Norte es conocida por su producción de cacao de alta calidad',
        'La isla de Bioko es de origen volcánico, formada hace millones de años',
        'Malabo combina arquitectura colonial española con modernos edificios gubernamentales',
        'La provincia cuenta con una rica biodiversidad marina y terrestre'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Malabo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/600px-Malabo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Malabo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Malabo.jpg/800px-Malabo.jpg'
      ]
    },
    {
      id: 3,
      name: 'Bioko Sur',
      slug: 'bioko-sur',
      capital: 'Luba',
      description: 'Ubicada en la parte meridional de la isla de Bioko, Bioko Sur es una provincia de naturaleza pristina con 1,241 km² de superficie. Con una población de aproximadamente 34,674 habitantes, es conocida por sus playas, reservas naturales y la tranquilidad de su capital, Luba.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Luba.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Situada en la parte meridional de la isla de Bioko, limita al norte con Bioko Norte y está rodeada por el golfo de Guinea en las demás direcciones. Es la parte más extensa de la isla.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 34,674 habitantes (2015), siendo menos poblada que Bioko Norte. La población se concentra principalmente en Luba y Riaba, con comunidades más pequeñas en áreas rurales.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Superficie de 1,241 km² con paisajes volcánicos, playas vírgenes y selva tropical densa. La región es conocida por su biodiversidad y áreas protegidas.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Senderismo en la Reserva Científica de la Caldera de Luba, buceo en playas vírgenes, observación de tortugas marinas, pesca artesanal y ecoturismo en áreas protegidas.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Luba',
          description: 'La capital provincial, un pintoresco puerto pesquero conocido por su tranquilidad y sus playas. Punto de partida ideal para explorar la reserva natural cercana.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 2,
          title: 'Reserva Científica de la Caldera de Luba',
          description: 'Una de las reservas naturales más importantes de África Occidental, hogar de primates endémicos, aves raras y una exuberante vegetación tropical.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 3,
          title: 'Riaba',
          description: 'Un encantador pueblo costero conocido por sus playas de arena volcánica negra y sus tradiciones pesqueras. Ideal para quienes buscan tranquilidad y contacto con la naturaleza.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        },
        {
          id: 4,
          title: 'Playas de Ureca',
          description: 'Famosa por ser uno de los principales lugares de anidación de tortugas marinas en África Occidental. Un espectáculo natural único durante la temporada de desove.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
        }
      ],
      facts: [
        'Bioko Sur es más extensa pero menos poblada que Bioko Norte',
        'La Reserva Científica de la Caldera de Luba es una de las áreas protegidas más importantes del país',
        'Luba es conocida como la "capital verde" de Bioko por su entorno natural',
        'La provincia es hogar de especies endémicas que no se encuentran en ningún otro lugar del mundo',
        'Las playas de arena volcánica negra son una característica única de la región',
        'La economía local se basa principalmente en la pesca y la agricultura de subsistencia'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Luba.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/600px-Luba.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Luba.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Luba.jpg/800px-Luba.jpg'
      ]
    },
    {
      id: 4,
      name: 'Litoral',
      slug: 'litoral',
      capital: 'Bata',
      description: 'La provincia más poblada de Guinea Ecuatorial con 367,348 habitantes, extendiéndose por todo el litoral atlántico de la región continental. Bata, su capital, es la ciudad más grande del país y un importante centro económico, comercial y portuario.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bata.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Se extiende por todo el litoral atlántico de la región continental. Limita al norte con Camerún, al este con Centro Sur, al sur con Gabón y al oeste con el golfo de Guinea.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 367,348 habitantes (2015), siendo la provincia más poblada del país. Bata concentra gran parte de la población y es el principal centro urbano continental.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Superficie de 6,665.7 km² con extensas playas, manglares y selva costera. Incluye la isla de Corisco, conocida por sus playas paradisíacas y aguas cristalinas.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Vida urbana en Bata, playas en Corisco y Mbini, buceo, pesca deportiva, observación de manglares, vida nocturna, gastronomía costera y comercio en el puerto de Bata.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Bata',
          description: 'La ciudad más grande de Guinea Ecuatorial y principal centro económico continental. Con modernos edificios, mercados vibrantes, playas urbanas y una vida cultural activa.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 2,
          title: 'Isla de Corisco',
          description: 'Una isla paradisíaca con playas de arena blanca y aguas turquesas. Ideal para buceo, relajación y escapadas tranquilas lejos del bullicio urbano.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 3,
          title: 'Mbini',
          description: 'Un encantador pueblo costero conocido por su puente histórico sobre el río Mbini, sus playas y su ambiente tranquilo. Perfecto para quienes buscan autenticidad.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        },
        {
          id: 4,
          title: 'Kogo',
          description: 'Una ciudad costera con una rica historia colonial y playas hermosas. Conecta la costa con el interior continental y es un importante punto de comercio.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
        }
      ],
      facts: [
        'Bata es la ciudad más grande de Guinea Ecuatorial por población',
        'La provincia incluye 7 municipios, incluyendo la isla de Corisco',
        'El puerto de Bata es uno de los más importantes del golfo de Guinea',
        'Litoral es conocida por su diversidad cultural, mezclando tradiciones locales con influencias coloniales',
        'Las playas de la provincia son ideales para el turismo costero y la pesca deportiva',
        'Bata cuenta con infraestructura moderna, incluyendo aeropuerto, hoteles y centros comerciales'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bata.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/600px-Bata.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bata.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bata.jpg/800px-Bata.jpg'
      ]
    },
    {
      id: 5,
      name: 'Centro Sur',
      slug: 'centro-sur',
      capital: 'Evinayong',
      description: 'Ubicada en la parte central de la región continental con una superficie de 9,930.8 km², Centro Sur es la provincia más extensa del país. Con aproximadamente 141,986 habitantes, se caracteriza por su densa selva tropical, ríos importantes y economía basada en la agricultura y la explotación forestal.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Evinayong.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Situada en la parte central de la región continental. Limita al norte con Camerún y Kié-Ntem, al este con Wele-Nzas y Djibloho, al sur con Gabón y al oeste con Litoral.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 141,986 habitantes (2015) distribuidos en tres municipios principales: Evinayong, Acurenam y Niefang. La población es principalmente rural y se dedica a la agricultura.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Superficie de 9,930.8 km² de selva tropical densa, atravesada por varios ríos importantes. Es la provincia más extensa del país con una rica biodiversidad forestal.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Ecoturismo en la selva tropical, observación de flora y fauna, pesca en ríos, senderismo, visitas a comunidades locales, agricultura tradicional y explotación forestal sostenible.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Evinayong',
          description: 'La capital provincial, un importante centro administrativo y comercial en el corazón de la selva. Conecta las diferentes regiones del país y es punto de paso para rutas comerciales.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 2,
          title: 'Selva Tropical',
          description: 'Extensas áreas de selva tropical con una rica biodiversidad. Hogar de numerosas especies de plantas, aves y animales, incluyendo primates y grandes mamíferos.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 3,
          title: 'Ríos y Cascadas',
          description: 'Numerosos ríos atraviesan la provincia, creando paisajes espectaculares con cascadas y pozas naturales. Ideales para la pesca y el ecoturismo acuático.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        },
        {
          id: 4,
          title: 'Acurenam y Niefang',
          description: 'Municipios importantes que mantienen tradiciones agrícolas ancestrales y ofrecen una visión auténtica de la vida rural en Guinea Ecuatorial continental.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
        }
      ],
      facts: [
        'Centro Sur es la provincia más extensa de Guinea Ecuatorial con 9,930.8 km²',
        'La economía se basa principalmente en la agricultura, especialmente cacao, café y cultivos de subsistencia',
        'La provincia alberga importantes reservas forestales con una rica biodiversidad',
        'Evinayong es un importante nudo de comunicaciones entre las provincias continentales',
        'La selva tropical de la provincia es parte del ecosistema de la cuenca del Congo',
        'Centro Sur cuenta con comunidades que mantienen tradiciones culturales ancestrales'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Evinayong.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/600px-Evinayong.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Evinayong.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evinayong.jpg/800px-Evinayong.jpg'
      ]
    },
    {
      id: 6,
      name: 'Kié-Ntem',
      slug: 'kie-ntem',
      capital: 'Ebibeyin',
      description: 'Situada en la parte noreste de la región continental con 3,942.9 km², Kié-Ntem es una provincia fronteriza que limita con Camerún y Gabón. Con aproximadamente 183,664 habitantes, es conocida por su comercio transfronterizo, agricultura y comunidades que mantienen fuertes lazos culturales con países vecinos.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ebibeyin.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Situada en la parte noreste de la región continental. Limita al norte con Camerún, al este con Gabón (provincia de Woleu-Ntem), al sur con Wele-Nzas y al oeste con Centro Sur.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 183,664 habitantes (2015) distribuidos en seis municipios. Ebibeyin es el principal centro urbano y punto de comercio transfronterizo importante.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Superficie de 3,942.9 km² con selva tropical, ríos fronterizos y áreas agrícolas. La región es conocida por sus cultivos de cacao y su proximidad a las fronteras internacionales.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Comercio transfronterizo, agricultura, visitas a plantaciones de cacao, ecoturismo, observación de aves, senderismo en áreas fronterizas y experiencias culturales con comunidades locales.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Ebibeyin',
          description: 'La capital provincial y uno de los principales puntos de comercio transfronterizo del país. Conecta Guinea Ecuatorial con Camerún y Gabón, siendo un centro comercial dinámico.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 2,
          title: 'Micomeseng',
          description: 'Un importante municipio conocido por sus plantaciones de cacao y su ubicación estratégica. Refleja la importancia agrícola de la provincia.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 3,
          title: 'Nsok-Nsomo',
          description: 'Un municipio rural que mantiene tradiciones ancestrales y ofrece una visión auténtica de la vida campesina en la región fronteriza.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        },
        {
          id: 4,
          title: 'Cultura Fronteriza',
          description: 'La provincia refleja una rica mezcla cultural debido a su ubicación fronteriza, con influencias de Camerún, Gabón y tradiciones locales ecuatoguineanas.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
        }
      ],
      facts: [
        'Kié-Ntem es una provincia estratégica por su ubicación fronteriza con Camerún y Gabón',
        'Ebibeyin es un importante centro de comercio transfronterizo en África Central',
        'La provincia es conocida por su producción de cacao de alta calidad',
        'Kié-Ntem cuenta con 86 consejos de poblado en el distrito de Ebibeyin',
        'La región mantiene fuertes lazos culturales y comerciales con países vecinos',
        'La economía combina agricultura tradicional con comercio internacional'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ebibeyin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/600px-Ebibeyin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ebibeyin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ebibeyin.jpg/800px-Ebibeyin.jpg'
      ]
    },
    {
      id: 7,
      name: 'Wele-Nzas',
      slug: 'wele-nzas',
      capital: 'Mongomo',
      description: 'Ubicada en la parte sureste de la región continental con 5,025.6 km², Wele-Nzas es una provincia de gran importancia política y cultural. Con aproximadamente 192,017 habitantes, su capital Mongomo es la ciudad natal de varios líderes políticos del país y es conocida por su desarrollo y tradiciones culturales.',
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Mongomo.jpg',
      infoCards: [
        {
          id: 1,
          title: 'Ubicación',
          content: 'Ubicada en la parte sureste de la región continental. Limita al norte con Kié-Ntem, al este y sur con Gabón, y al oeste con Centro Sur y Djibloho.',
          icon: '📍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 2,
          title: 'Población',
          content: 'Aproximadamente 192,017 habitantes (2015) distribuidos en cuatro municipios principales. Mongomo es el centro más importante y cuenta con infraestructura moderna.',
          icon: '👥',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 3,
          title: 'Geografía',
          content: 'Superficie de 5,025.6 km² con selva tropical, áreas agrícolas y comunidades rurales. La región es conocida por su producción agrícola y su importancia cultural.',
          icon: '🗻',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 4,
          title: 'Actividades',
          content: 'Visitas a Mongomo, experiencias culturales, agricultura, ecoturismo, observación de tradiciones locales, visitas a Añisok, Aconibe y Nsork, y exploración de la selva tropical.',
          icon: '🏄',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        }
      ],
      highlights: [
        {
          id: 1,
          title: 'Mongomo',
          description: 'La capital provincial, conocida por ser la ciudad natal de importantes figuras políticas. Con infraestructura moderna, estadio internacional y desarrollo urbano significativo.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 2,
          title: 'Añisok',
          description: 'Un municipio importante que mantiene tradiciones culturales y ofrece una visión de la vida rural en la región sureste del país.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 3,
          title: 'Aconibe',
          description: 'Un centro agrícola conocido por sus cultivos y su papel en la economía local. Refleja la importancia de la agricultura en la provincia.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        },
        {
          id: 4,
          title: 'Nsork',
          description: 'Un municipio fronterizo con Gabón que muestra la interacción cultural y comercial entre ambos países en la región sureste.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
        }
      ],
      facts: [
        'Mongomo es la ciudad natal de varios presidentes de Guinea Ecuatorial',
        'La provincia cuenta con el Estadio de Mongomo, sede de importantes eventos deportivos',
        'Wele-Nzas es conocida por su importancia política y cultural en el país',
        'La región mantiene fuertes tradiciones culturales y comunitarias',
        'La agricultura es una actividad económica fundamental en la provincia',
        'Mongomo ha experimentado un desarrollo urbano significativo en las últimas décadas'
      ],
      gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Mongomo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/600px-Mongomo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Mongomo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mongomo.jpg/800px-Mongomo.jpg'
      ]
    }
  ])

  // Servicios
  const services = ref<Service[]>([
    {
      id: 1,
      title: 'Alquiler de Coches',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
      slug: 'alquiler-coches',
      description: 'Alquila un coche para explorar Guinea Ecuatorial a tu ritmo'
    },
    {
      id: 2,
      title: 'Alquiler de Casas',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
      slug: 'alquiler-casas',
      description: 'Encuentra el alojamiento perfecto para tu estancia'
    },
    {
      id: 3,
      title: 'Agencias de Viajes',
      imageUrl: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&auto=format&fit=crop&q=80',
      slug: 'agencias-viajes',
      description: 'Planifica tu viaje con las mejores agencias locales'
    }
  ])

  // Artículos de Cultura e Historia
  const culturaArticles = ref<CulturaArticle[]>([
    {
      id: 1,
      title: 'Paseo Marítimo de Malabo: el corazón azul de la capital te espera',
      slug: 'paseo-maritimo-malabo',
      excerpt: 'Descubre la esencia de Malabo en su malecón emblemático. El Paseo Marítimo de Malabo no es solo un malecón; es la arteria vital que abraza la espectacular bahía de la capital de Guinea Ecuatorial.',
      content: `<h1>Paseo Marítimo de Malabo: el corazón azul de la capital te espera</h1>
        <h2>Descubre la esencia de Malabo en su malecón emblemático</h2>
        <p>El Paseo Marítimo de Malabo no es solo un malecón; es la arteria vital que abraza la espectacular bahía de la capital de Guinea Ecuatorial. Con varios kilómetros para explorar, este espacio fue concebido para ser el principal escenario de ocio, encuentro y esparcimiento de la ciudad, ofreciendo a locales y visitantes la mejor vista hacia el Atlántico.</p>
        <p>Imagínate caminando bajo las altas palmeras que se mecen con la brisa, encontrando rincones sombreados, o disfrutando de un café en los pequeños locales. Es el entorno ideal para desconectar, hacer ejercicio o, simplemente, ser testigo del dinámico encuentro entre el pulso urbano y la inmensidad del mar.</p>
        <h2>Un escenario de atardeceres mágicos</h2>
        <p>Prepárate para la hora dorada. Uno de los mayores atractivos del paseo son sus panorámicas inigualables sobre la bahía y las colinas cercanas. Los atardeceres aquí son francamente mágicos, un espectáculo de luces doradas que se reflejan sobre el agua, creando el fondo perfecto para la fotografía y la contemplación. ¡Es la vista que no te puedes perder en Malabo!</p>
        <h2>Tu espacio de encuentro y deporte</h2>
        <p>El malecón te invita a moverte. Es el lugar predilecto para los amantes del footing, para pasear tranquilamente o para disfrutar de un recorrido completo en bicicleta (incluso puedes alquilarlas en hoteles cercanos). La presencia de bares, cafés y restaurantes con terraza te permite disfrutar de la brisa marina mientras socializas y saboreas la gastronomía local.</p>
        <h2>Cultura que late en la costa</h2>
        <p>El Paseo Marítimo es el punto neurálgico donde la cultura cobra vida. Ha sido escenario de vibrantes ferias del libro, exposiciones culturales y eventos gastronómicos, consolidando su papel como una gran ágora comunitario. Visítalo y descubre por qué es uno de los espacios públicos más dinámicos y con más identidad de Malabo.</p>
        <h2>La promesa de la revitalización</h2>
        <p>El Paseo Marítimo no es solo una ruta, es la identidad de la capital. Es el punto de encuentro esencial para familias, jóvenes, turistas y expatriados, combinando la naturaleza costera con el urbanismo de Malabo.</p>
        <p>Cuando el sol se hunde en el horizonte, la brisa marina sopla fresca y las palmeras se mecen, el Paseo Marítimo revela su verdadera esencia: el corazón azul que late en el alma de Malabo. Ven a caminarlo, a disfrutarlo y a ser parte de la esperanza de su revitalización.</p>
        <p><strong>¡Tú paseo te espera!</strong></p>`,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      location: 'Bioko Norte, Malabo',
      category: 'ocio'
    },
    {
      id: 2,
      title: 'Finca Sampaka: El Cacao de Bioko que Cuenta la Historia Viva de un País',
      slug: 'finca-sampaka',
      excerpt: 'La finca más emblemática de Guinea Ecuatorial: un recorrido entre tradición, memoria colonial y el renacimiento del chocolate. Fundada alrededor de 1906, esta finca no solo destaca por la calidad excepcional de su cacao.',
      content: `<h1>Finca Sampaka: El Cacao de Bioko que Cuenta la Historia Viva de un País</h1>
        <h2>La finca más emblemática de Guinea Ecuatorial: un recorrido entre tradición, memoria colonial y el renacimiento del chocolate</h2>
        <p>A pocos kilómetros de Malabo, escondida entre colinas húmedas y bosques centenarios, se extiende Finca Sampaka, una de las plantaciones más antiguas y simbólicas de Guinea Ecuatorial. Fundada alrededor de 1906, esta finca no solo destaca por la calidad excepcional de su cacao, sino por atesorar una parte esencial de la historia agrícola, social y cultural de la isla de Bioko.</p>
        <p>Hoy, más de un siglo después, Sampaka no solo mantiene su legado como referente del cacao local, sino que se erige como un puente entre el pasado colonial y un presente que apuesta por la modernización, la diversificación y la creación de valor añadido.</p>
        <h2>Un Nombre, Una Historia: "Sampaka"</h2>
        <p>El origen del nombre es tan singular como el enclave mismo. Según los registros históricos, la finca debe su nombre a Samuel Parker, un hombre procedente de Liberia que se asentó en estas tierras a principios del siglo XX. Su nombre, transformado y adaptado por el lenguaje pidgin local, evolucionó de 'Sam Parker' a 'Sam Peik', y finalmente al actual Sampaka.</p>
        <p>La finca llegó a abarcar cerca de 1.000 hectáreas, convirtiéndose en una de las haciendas agrícolas más influyentes de la isla y un motor económico clave para los propietarios.</p>
        <h2>Una Finca que Narra el Pasado</h2>
        <p>La icónica casa colonial, construida en madera y pintada en tonos verdes, es hoy uno de los símbolos más fotografiados y un mudo testigo de la memoria de la finca. Representa un tiempo en que Sampaka fue el centro agrícola y núcleo social donde convivieron poblaciones locales, colonos y migrantes.</p>
        <p>Durante décadas, Sampaka fue un pilar económico fundamental de la isla de Bioko, desde aquí, se exportaba cacao de enorme calidad, siendo un elemento central en la economía de Bioko.</p>
        <h2>Del cacao al renacimiento agrícola</h2>
        <p>Tras su integración en la empresa CAMASA en los años 90, la finca inició un riguroso proceso de modernización, diversificación y sostenibilidad.</p>
        <h3>Hoy, Sampaka produce:</h3>
        <ul>
          <li><strong>Cacao fino y aromático</strong>: El producto estrella, base del chocolate gourmet.</li>
          <li><strong>Café y especias</strong>: Cultivo de variedades locales.</li>
          <li><strong>Viveros y flores</strong>: Plantas ornamentales y tropicales para la reforestación.</li>
        </ul>
        <p>Además de la cosecha, el compromiso de la finca con el futuro es palpable: se han reforestado más de 300.000 árboles y replantado alrededor de 2 millones de cacaoteros, asegurando la sostenibilidad a largo plazo del cultivo.</p>
        <h2>El giro estratégico: Chocolate "Tree-to-Bar"</h2>
        <p>Sampaka ha dado un giro estratégico: ha trascendido la imagen de simple plantación para convertirse en pionera de la producción de chocolate artesanal de alta gama, elaborado íntegramente en Bioko.</p>
        <p>El modelo "tree-to-bar" (del árbol a la tableta) permite a la finca controlar cada etapa del proceso, garantizando la excelencia y la trazabilidad:</p>
        <ol>
          <li><strong>Cultivo y cosecha</strong>: Selección manual del cacao.</li>
          <li><strong>Fermentación y secado</strong>: Procesos cruciales realizados en piedra de pizarra para potenciar el sabor.</li>
          <li><strong>Transformación</strong>: Tostado y refinamiento en chocolate fino, 100% ecuatoguineano.</li>
        </ol>
        <p>Este cambio no solo aporta valor añadido local e impulsa el empleo, sino que posiciona a Guinea Ecuatorial en el exigente mercado internacional de chocolates gourmet. Los visitantes pueden degustar y adquirir nibs de cacao, tabletas, cremas y café cultivados en la misma finca.</p>
        <h2>Un destino turístico inesperado</h2>
        <p>En los últimos años, Finca Sampaka ha florecido como un punto clave para el turismo agro-cultural y sostenible.</p>
        <h3>La experiencia Sampaka:</h3>
        <ul>
          <li><strong>Recorridos históricos</strong>: Visitas guiadas por plantaciones centenarias.</li>
          <li><strong>Ruta del cacao</strong>: Observación del proceso completo, desde el fruto hasta el grano.</li>
          <li><strong>Legado colonial</strong>: Exploración de la histórica casa colonial.</li>
          <li><strong>Sabor y tradición</strong>: Participación en catas de chocolate artesanal y degustación de productos.</li>
        </ul>`,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&auto=format&fit=crop&q=80',
      location: 'Bioko Norte, Malabo',
      category: 'gastronomia'
    },
    {
      id: 3,
      title: 'Kié-Ntem: La triple frontera de Guinea Ecuatorial, un destino para viajeros pioneros',
      slug: 'kie-ntem-triple-frontera',
      excerpt: 'Naturaleza indómita y cultura viva: Explora la provincia que toca Camerún y Gabón, donde la selva, los ríos y la autenticidad se conjugan para ofrecer una aventura sin igual.',
      content: `<h1>Kié-Ntem: La triple frontera de Guinea Ecuatorial, un destino para viajeros pioneros</h1>
        <h2>Naturaleza indómita y cultura viva</h2>
        <p>Explora la provincia que toca Camerún y Gabón, donde la selva, los ríos y la autenticidad se conjugan para ofrecer una aventura sin igual.</p>
        <h2>Al filo de tres mundos</h2>
        <p>Situada en el extremo nororiental de la región continental, la provincia de Kié-Ntem es un enclave de transición donde la selva, los grandes ríos y las fronteras configuran un entorno mágico, poco conocido pero lleno de promesas para el viajero atento.</p>
        <p>Con capital en Ebebiyín, la región está estratégicamente delimitada por Camerún al norte y Gabón al este, lo que la convierte en un mosaico de intercambios humanos, comerciales y culturales. Esta provincia se revela como un tesoro de recursos naturales, culturales y turísticos que invita no solo a ser visitado, sino a ser vivido y descubierto en su estado más puro.</p>
        <h2>Geografía y alma de la selva: La llamada del Río Ntem</h2>
        <p>El paisaje de Kié-Ntem está dominado por un relieve suave y una compleja red hidrográfica. El valle del Río Ntem (o Campo) y sus afluentes trazan una frontera natural fluida que avanza hacia el Atlántico.</p>
        <p>Para el viajero, esto se traduce en:</p>
        <ul>
          <li><strong>Paisajes de selva tropical</strong>: Una inmersión total en el "soplo de lo verde".</li>
          <li><strong>Aventura fluvial</strong>: Ríos que pueden explorarse y que ofrecen esa sensación única de "estar al final del camino".</li>
          <li><strong>Potencial eco-turístico</strong>: El entorno, especialmente las colinas de Nsok Nsomo, sugiere una rica biodiversidad y un enorme potencial para el senderismo y la fotografía de naturaleza. Las estaciones secas (diciembre-febrero y junio-agosto) ofrecen la mejor ventana para la exploración.</li>
        </ul>
        <h2>Cultura y comunidad: El pulso de la frontera viva</h2>
        <p>Kié-Ntem es el lugar de encuentro de culturas. La capital, Ebebiyín, es un crisol donde los mercados transfronterizos, la artesanía y el comercio de paso revelan una vida urbana que dialoga constantemente con lo rural y con sus vecinos de Camerún y Gabón.</p>
        <p><strong>Herencia religiosa y colonial</strong>: La Catedral de Ebebiyín, terminada en 1950 en estilo neogótico, es un hito arquitectónico y testigo de la herencia religiosa del país.</p>
        <p><strong>Identidad profunda</strong>: La cultura fang y otras etnias locales moldean la provincia con sus lenguas, música y conocimientos ancestrales, creando un ambiente auténtico y libre de las influencias de la globalización.</p>
        <p>Para el visitante que busca conectar más allá de "tomar fotos", Kié-Ntem ofrece la oportunidad de observar mercados locales, interactuar con comunidades y contemplar cómo lo tradicional aún pulsa con fuerza.</p>
        <h2>Itinerario de descubrimiento: joyas ocultas de Kié-Ntem</h2>
        <p>Kié-Ntem es un destino para el viajero que se arriesga a explorar lo no masificado. Aquí, una selección de los destinos más atractivos:</p>
        <ul>
          <li><strong>Ebebiyín</strong>: Base de exploración. Percibir el carácter triple fronterizo en sus mercados y avenidas.</li>
          <li><strong>Nsok Nsomo</strong>: Colinas, claros de selva y ríos. Ideal para caminatas y fotografía en calma.</li>
          <li><strong>Lago Abochama (Micomeseng)</strong>: Recurso natural de interés turístico. Ofrece tranquilidad rural y actividades al aire libre.</li>
          <li><strong>Cueva Caracas</strong>: Formación de granito cerca de Ebebiyín. Aventura ligera para explorar las entrañas de la piedra y la penumbra.</li>
          <li><strong>Río Ntem</strong>: La frontera natural viva. Ideal para visitas guiadas a la ribera, observando cómo la geografía dibuja los límites.</li>
        </ul>
        <h2>Turismo responsable: La guía del viajero pionero</h2>
        <p>Kié-Ntem te ofrece el regalo de la autenticidad, pero exige responsabilidad y preparación.</p>
        <h3>Logística Esencial:</h3>
        <ul>
          <li><strong>Transporte</strong>: Se recomienda vehículo todoterreno y verificar el estado de las carreteras en zonas remotas.</li>
          <li><strong>Guía local</strong>: imprescindible para acceder a zonas rurales, interpretar flora/fauna y asegurar una estadía respetuosa.</li>
          <li><strong>Época de Visita</strong>: Se prefiere la estación seca (diciembre-febrero o junio-agosto) para evitar caminos intransitables por las lluvias.</li>
        </ul>
        <h3>Cuidados Ambientales:</h3>
        <p>Ecosistema Frágil: Sigue principios básicos de no dejar residuos y permanecer en rutas autorizadas.</p>
        <h2>La Invitación a lo Auténtico</h2>
        <p>La provincia de Kié-Ntem está en camino de transformarse, pero aún conserva su carácter intacto. Este momento ofrece una ventaja al visitante pionero: menos multitudes, experiencias más directas y la posibilidad de "ser de los primeros" en conocer rincones poco explorados.</p>
        <p>Si buscas un lugar distinto, sin los clichés del turismo de masas, donde la selva, la frontera, la comunidad y el silencio se conjuguen, la provincia de Kié-Ntem te está esperando.</p>
        <p>Prepara la mochila, abre los sentidos y permite que Kié-Ntem no solo se vea, sino se sienta. Después de todo, viajar no es solo cambiar de paisaje: es dejarse cambiar por él.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
      location: 'Kié-Ntem, Ebebiyín',
      category: 'naturaleza'
    },
    {
      id: 4,
      title: 'Bioko Norte: La joya del golfo de Guinea que late entre volcanes, selva y modernidad africana',
      slug: 'bioko-norte-joya-golfo-guinea',
      excerpt: 'Descubre Bioko Norte, una provincia única que combina la imponente naturaleza volcánica, la selva tropical y la vibrante modernidad de la capital Malabo.',
      content: `<h1>Bioko Norte: La joya del golfo de Guinea que late entre volcanes, selva y modernidad africana</h1>
        <h2>Un encuentro único entre naturaleza y urbanismo</h2>
        <p>Bioko Norte representa uno de los destinos más fascinantes de Guinea Ecuatorial, una provincia donde conviven los volcanes extintos, la selva tropical primaria y la modernidad de Malabo, la capital del país.</p>
        <h2>La geografía única de Bioko</h2>
        <p>La isla de Bioko, antigua Fernando Poo, es de origen volcánico y alberga en su territorio provincial una rica diversidad geográfica. Desde las playas de arena negra hasta las cumbres volcánicas, pasando por la densa selva tropical que cubre gran parte de su territorio.</p>
        <h2>Malabo: Capital moderna con alma histórica</h2>
        <p>Malabo, la capital de Guinea Ecuatorial, combina la arquitectura colonial española con modernos edificios que reflejan el crecimiento económico del país. Sus calles, plazas y edificios históricos narran la historia de la isla desde la época colonial hasta la independencia y el desarrollo actual.</p>
        <h2>Naturaleza imponente</h2>
        <p>La provincia de Bioko Norte está dominada por el Pico Basile, un volcán extinto que se eleva a más de 3.000 metros sobre el nivel del mar. Los bosques nubosos y la selva tropical albergan una biodiversidad única, incluyendo especies endémicas de flora y fauna.</p>
        <h2>Cultura y tradición</h2>
        <p>La cultura de Bioko Norte es un reflejo de su historia como punto de encuentro entre África y Europa. Las tradiciones locales de los bubi y otras etnias se entrelazan con influencias coloniales, creando una identidad cultural única y vibrante.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73bb0?w=1200&auto=format&fit=crop&q=80',
      location: 'Bioko Norte, Malabo',
      category: 'cultura'
    },
    {
      id: 5,
      title: 'La Noche Ecuatoguineana: La vida nocturna vibrante de Malabo',
      slug: 'noche-ecuatoguineana-malabo',
      excerpt: 'Sumérgete en la vida nocturna de Malabo, donde la música, la gastronomía y la cultura local se combinan para crear experiencias inolvidables.',
      content: `<h1>La Noche Ecuatoguineana: La vida nocturna vibrante de Malabo</h1>
        <h2>Cuando el sol se oculta, Malabo despierta</h2>
        <p>La capital de Guinea Ecuatorial cobra vida cuando cae la noche. Malabo ofrece una experiencia nocturna única que combina música africana, gastronomía local y el ambiente internacional de una ciudad cosmopolita.</p>
        <h2>Música y baile</h2>
        <p>Los ritmos tradicionales ecuatoguineanos se fusionan con música moderna en los locales nocturnos de Malabo. Desde música makossa hasta ritmos más contemporáneos, la ciudad ofrece opciones para todos los gustos musicales.</p>
        <h2>Gastronomía nocturna</h2>
        <p>Los restaurantes y bares de Malabo sirven tanto comida local como internacional. Disfruta de platos tradicionales como el pescado a la parrilla, yuca frita o arroz con pescado, acompañados de cerveza local o refrescantes bebidas tropicales.</p>
        <h2>Ambiente cosmopolita</h2>
        <p>La vida nocturna de Malabo refleja su carácter internacional. Locales y expatriados se mezclan en bares, discotecas y restaurantes, creando un ambiente dinámico y acogedor.</p>
        <h2>Seguridad y disfrute</h2>
        <p>Malabo es una ciudad relativamente segura para disfrutar de la vida nocturna. Los establecimientos principales están bien iluminados y ofrecen ambientes agradables para pasar la noche.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      location: 'Bioko Norte, Malabo',
      category: 'ocio'
    },
    {
      id: 6,
      title: 'La catedral de Santa Isabel: el alma neogótica de Malabo resurgida de las cenizas',
      slug: 'catedral-santa-isabel-malabo',
      excerpt: 'Conoce la imponente Catedral de Santa Isabel, un monumento histórico que representa la herencia religiosa y arquitectónica colonial de Malabo.',
      content: `<h1>La catedral de Santa Isabel: el alma neogótica de Malabo resurgida de las cenizas</h1>
        <h2>Un símbolo de fe y resistencia</h2>
        <p>La Catedral de Santa Isabel es uno de los monumentos más emblemáticos de Malabo. Construida en estilo neogótico durante la época colonial, esta imponente construcción religiosa ha sido testigo de la historia de la isla de Bioko y del país.</p>
        <h2>Arquitectura neogótica en África</h2>
        <p>La catedral presenta las características típicas del estilo neogótico: arcos apuntados, vidrieras, y una estructura vertical imponente. Su construcción en medio de la selva tropical crea un contraste arquitectónico único.</p>
        <h2>Historia y restauración</h2>
        <p>A lo largo de su historia, la Catedral de Santa Isabel ha sufrido diversos daños, incluyendo incendios que la dejaron parcialmente destruida. Sin embargo, ha sido restaurada en varias ocasiones, resurgiendo de las cenizas para continuar siendo un lugar de culto y símbolo de la comunidad católica en Guinea Ecuatorial.</p>
        <h2>Centro espiritual y cultural</h2>
        <p>Hoy en día, la catedral no solo es un lugar de culto, sino también un centro cultural importante. Sus ceremonias religiosas, especialmente durante las festividades católicas, congregan a fieles de toda la ciudad.</p>
        <h2>Visita y contemplación</h2>
        <p>La Catedral de Santa Isabel está abierta a visitantes que deseen contemplar su arquitectura y conocer su historia. Es un lugar de paz y reflexión en el corazón de Malabo.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1555993536-29372e4f5085?w=1200&auto=format&fit=crop&q=80',
      location: 'Bioko Norte, Malabo',
      category: 'cultura'
    },
    {
      id: 7,
      title: 'Arquitectura colonial en Guinea Ecuatorial: El legado híbrido que renace entre selva y mar',
      slug: 'arquitectura-colonial-guinea-ecuatorial',
      excerpt: 'Explora el fascinante patrimonio arquitectónico colonial que combina estilos europeos con adaptaciones tropicales, creando un legado único en África.',
      content: `<h1>Arquitectura colonial en Guinea Ecuatorial: El legado híbrido que renace entre selva y mar</h1>
        <h2>Un patrimonio arquitectónico único</h2>
        <p>Guinea Ecuatorial posee un patrimonio arquitectónico colonial fascinante que refleja la adaptación de estilos europeos a las condiciones tropicales del país. Este legado híbrido combina elementos arquitectónicos españoles con soluciones prácticas para el clima ecuatorial.</p>
        <h2>Estilos arquitectónicos coloniales</h2>
        <p>La arquitectura colonial en Guinea Ecuatorial incluye diversos estilos: desde edificios neogóticos como la Catedral de Santa Isabel, hasta casas coloniales con amplios porches, ventilación cruzada y techos de zinc que reflejan la sabiduría arquitectónica adaptada al trópico.</p>
        <h2>Casas coloniales y edificios administrativos</h2>
        <p>Las casas coloniales de Malabo y otras ciudades muestran características típicas: estructuras de madera, colores pastel, balcones y terrazas que aprovechan las brisas marinas. Los edificios administrativos reflejan el poder colonial con arquitectura más monumental.</p>
        <h2>Adaptación al clima tropical</h2>
        <p>Los arquitectos coloniales adaptaron sus diseños al clima: techos altos para mejorar la ventilación, ventanas grandes con persianas, y materiales que resisten la humedad y las lluvias torrenciales del trópico.</p>
        <h2>Preservación y renovación</h2>
        <p>En la actualidad, muchos de estos edificios coloniales están siendo preservados y renovados, encontrando nuevos usos como museos, hoteles o centros culturales. Este proceso de renovación está ayudando a mantener vivo el patrimonio arquitectónico del país.</p>
        <h2>Un legado que perdura</h2>
        <p>La arquitectura colonial en Guinea Ecuatorial es más que solo edificios: es un testimonio de la historia, la cultura y la capacidad de adaptación humana. Este legado híbrido entre selva y mar continúa siendo parte fundamental del paisaje urbano del país.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80',
      location: 'Guinea Ecuatorial',
      category: 'cultura'
    },
    {
      id: 8,
      title: 'Wele-Nzas: La provincia continental donde la naturaleza y la tradición se encuentran',
      slug: 'wele-nzas',
      excerpt: 'Descubre Wele-Nzas, una provincia rica en naturaleza, cultura tradicional y recursos naturales en la región continental de Guinea Ecuatorial.',
      content: `<h1>Wele-Nzas: La provincia continental donde la naturaleza y la tradición se encuentran</h1>
        <h2>El corazón continental de Guinea Ecuatorial</h2>
        <p>Wele-Nzas es una de las provincias continentales de Guinea Ecuatorial, ubicada en la región de Río Muni. Esta provincia combina la rica biodiversidad de la selva tropical con tradiciones culturales ancestrales de las comunidades locales.</p>
        <h2>Naturaleza y biodiversidad</h2>
        <p>La provincia de Wele-Nzas está cubierta principalmente por selva tropical, albergando una gran diversidad de flora y fauna. La región es ideal para el ecoturismo y la observación de naturaleza, con múltiples especies de aves, primates y otros animales salvajes.</p>
        <h2>Cultura tradicional</h2>
        <p>Las comunidades locales de Wele-Nzas mantienen vivas sus tradiciones ancestrales. La cultura fang, predominante en la región, se expresa a través de la música, danza, artesanía y ceremonias tradicionales que han perdurado a lo largo de los siglos.</p>
        <h2>Recursos naturales</h2>
        <p>La provincia es rica en recursos naturales, incluyendo madera, minerales y productos agrícolas. La agricultura tradicional sigue siendo importante para las comunidades locales, que cultivan productos como cacao, café y productos alimenticios básicos.</p>
        <h2>Desarrollo y futuro</h2>
        <p>Wele-Nzas se encuentra en un proceso de desarrollo que busca equilibrar el crecimiento económico con la preservación de su patrimonio natural y cultural. La provincia tiene un gran potencial para el turismo sostenible y el desarrollo rural.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
      location: 'Wele-Nzas, Guinea Ecuatorial',
      category: 'cultura'
    },
    {
      id: 9,
      title: 'Djibiloho: La nueva capital en construcción',
      slug: 'djibiloho',
      excerpt: 'Conoce Djibiloho, la futura capital administrativa de Guinea Ecuatorial, un ambicioso proyecto urbanístico que está transformando el país.',
      content: `<h1>Djibiloho: La nueva capital en construcción</h1>
        <h2>Un proyecto visionario</h2>
        <p>Djibiloho representa uno de los proyectos urbanísticos más ambiciosos de África: la construcción de una nueva capital administrativa para Guinea Ecuatorial. Este proyecto refleja la visión del país hacia el futuro y su apuesta por la modernización y el desarrollo.</p>
        <h2>Ubicación estratégica</h2>
        <p>La nueva ciudad está siendo construida en una ubicación estratégica en el territorio continental, diseñada para ser más accesible desde diferentes puntos del país y para centralizar las funciones administrativas del gobierno.</p>
        <h2>Arquitectura moderna</h2>
        <p>Djibiloho está siendo diseñada con arquitectura moderna y sostenible, incorporando los últimos avances en planificación urbana. La ciudad contempla espacios verdes, infraestructura moderna y edificios gubernamentales de gran envergadura.</p>
        <h2>Estado actual</h2>
        <p>El proyecto está en constante desarrollo, con nuevas construcciones y mejoras continuas. Aunque aún está en proceso de construcción, Djibiloho ya alberga algunas instituciones gubernamentales y está comenzando a tomar forma como la futura capital administrativa.</p>
        <h2>Impacto y perspectivas</h2>
        <p>La construcción de Djibiloho tiene un impacto significativo en el desarrollo del país, generando empleo, atrayendo inversión y posicionando a Guinea Ecuatorial como un país con visión de futuro. Es un proyecto que marcará el futuro del país.</p>
        <h2>Visita y observación</h2>
        <p>Visitar Djibiloho es una experiencia única: observar una ciudad en construcción, ver cómo se materializa una visión ambiciosa, y ser testigo de la transformación de un país en tiempo real.</p>`,
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      location: 'Djibiloho, Guinea Ecuatorial',
      category: 'cultura'
    }
  ])

  // Computed para filtrar artículos por categoría
  const getCulturaArticlesByCategory = computed(() => {
    return (category: string) => culturaArticles.value.filter(article => article.category === category)
  })

  const getProvinceInfoBySlug = computed(() => {
    return (slug: string) => provinceInfos.value.find(province => province.slug === slug)
  })

  // Computed properties
  const getPostBySlug = computed(() => {
    return (slug: string) => posts.value.find(post => post.slug === slug)
  })

  const getCulturaArticleBySlug = computed(() => {
    return (slug: string) => culturaArticles.value.find(article => article.slug === slug)
  })

  const getPostsByCategory = computed(() => {
    return (category: string) => posts.value.filter(post => post.category === category)
  })

  const featuredPosts = computed(() => {
    return posts.value.filter(post => post.featured)
  })

  const latestNews = computed(() => {
    return posts.value
      .filter(post => post.category === 'general')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  })

  // Sincronizar eventos y provincias desde Firestore en tiempo real
  subscribeEvents(firestoreEvents => {
    if (firestoreEvents.length > 0) {
      events.value = firestoreEvents.map(e => ({
        id: e.id as unknown as number,
        title: e.title,
        imageUrl: e.imageUrl,
        slug: e.slug,
        date: e.date,
        excerpt: e.excerpt
      }))
    }
  })

  subscribeProvinces(firestoreProvinces => {
    if (firestoreProvinces.length > 0) {
      provinces.value = firestoreProvinces.map(p => ({
        id: p.id as unknown as number,
        name: p.name,
        slug: p.slug,
        icon: p.icon,
        imageUrl: p.imageUrl
      }))
    }
  })

  return {
    posts,
    banners,
    slides,
    sponsors,
    events,
    provinces,
    provinceInfos,
    services,
    culturaArticles,
    getPostBySlug,
    getPostsByCategory,
    getCulturaArticleBySlug,
    getCulturaArticlesByCategory,
    getProvinceInfoBySlug,
    featuredPosts,
    latestNews
  }
})
