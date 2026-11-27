// Archivo musical de Casita Manolo.
//
// Cada estación es una caja de discos con su tema: los proyectos grandes
// tienen caja propia y los spots van juntos. Soltar un disco en el plato
// enciende el monitor si tiene vídeo; si es audio, suena sin reproductor.
//
// Para añadir un proyecto basta con meter un disco aquí. Los textos llevan
// sus idiomas al lado; `igual()` es para lo que no se traduce, como el
// nombre de una marca.

import type { Texto } from '../i18n/config';

/** Lo que suena o se ve al poner el disco. El audio suena sin abrir el monitor.
 *  `vertical` cambia el televisor por un móvil, para los anuncios de redes. */
export type Medio =
  | { tipo: 'video'; src: string; vertical?: boolean }
  | { tipo: 'vimeo'; id: string; vertical?: boolean }
  | { tipo: 'audio'; src: string };

export interface Disco {
  id: string;
  /** Rótulo corto sobre la carátula */
  etiqueta: Texto;
  /** Título grande bajo el plato */
  titulo: Texto;
  /** Línea bajo el título: tipo de trabajo, año… */
  detalle: Texto;
  /** Carátula: un fotograma del propio trabajo */
  portada: string;
  /** Color de la galleta del vinilo */
  galleta: string;
  /** Logo de la marca: impreso en la galleta y de marca de agua al sonar */
  logo?: string;
  /** Lo que sale de la funda. Por defecto, un vinilo */
  forma?: 'vinilo' | 'balon';
  /** Colores de los pentágonos del balón; si hay varios, se alternan */
  pentagonos?: string[];
  medio?: Medio;
}

export interface Notas {
  texto: Texto;
  sello?: string;
  fondo?: string;
  enlace?: { href: string; texto: Texto };
}

export type Tema = 'duelo' | 'tarara' | 'airbnb' | 'paula' | 'publicidad' | 'obra';

export interface Estacion {
  tema: Tema;
  /** Nombre en la cabecera */
  /** Corto y en mayúsculas: es el nombre de su pista en el disco del índice y el rótulo de arriba.
   *  El título largo del trabajo va en el disco, y la palabra de ambiente
   *  del fondo es `rotulo`. */
  nombre: Texto;
  /** Rótulo gigante de fondo */
  rotulo: Texto;
  izquierda: Disco[];
  derecha: Disco[];
  /** Tarjeta de notas en el estante derecho, cuando no hay discos */
  notas?: Notas;
}

const P = '/portfolio';
const L = '/portfolio/logos';

/** Lo que se escribe igual en todos los idiomas: marcas, nombres propios… */
const igual = (texto: string): Texto => ({ es: texto, en: texto, zh: texto });

export const estaciones: Estacion[] = [
  {
    tema: 'duelo',
    nombre: { es: 'DOCUS', en: 'DOCS', zh: '纪录片' },
    rotulo: { es: 'EL DUELO', en: 'THE DUEL', zh: '对决' },
    // Había dos discos, cara A y cara B, y los dos llevaban al mismo vídeo:
    // solo existe un montaje. La idea de las dos caras es buena y vuelve el
    // día que haya un segundo; de momento, un disco y la ficha al lado, como
    // en las demás estaciones de un solo trabajo. La carátula de Messi sigue
    // en public/portfolio/duelo-messi.webp para cuando toque.
    izquierda: [
      {
        id: 'duelo',
        etiqueta: { es: 'EL ÚLTIMO DUELO', en: 'EL ÚLTIMO DUELO', zh: '最后的对决' },
        titulo: { es: 'El Último Duelo', en: 'The Final Duel', zh: '最后的对决' },
        detalle: {
          es: 'Documental · Música original',
          en: 'Documentary · Original music',
          zh: '纪录片 · 原创音乐',
        },
        portada: `${P}/duelo-cristiano.webp`,
        galleta: '#c9a24a',
        forma: 'balon',
        pentagonos: ['#c9a24a'],
        medio: { tipo: 'vimeo', id: '1203280837' },
      },
    ],
    derecha: [],
    notas: {
      texto: {
        es: 'El último duelo entre Cristiano y Messi, contado en documental. La música es de la casa.',
        en: 'The final duel between Cristiano and Messi, told as a documentary. The music is ours.',
        zh: 'C罗与梅西的最后一次对决，拍成了纪录片。音乐出自我们之手。',
      },
    },
  },
  {
    tema: 'tarara',
    nombre: { es: 'FILM', en: 'FILM', zh: '电影' },
    rotulo: { es: 'CANNES', en: 'CANNES', zh: '戛纳' },
    izquierda: [
      {
        id: 'la-tarara',
        etiqueta: igual('LA TARARA'),
        titulo: igual('La Tarara'),
        detalle: {
          es: 'Spain, Where Talent Ignites · ICEX · Estreno en Cannes',
          en: 'Spain, Where Talent Ignites · ICEX · Premiered at Cannes',
          zh: 'Spain, Where Talent Ignites · ICEX · 戛纳首映',
        },
        portada: `${P}/la-tarara.webp`,
        galleta: '#b3141c',
        logo: `${L}/icex.png`,
        medio: { tipo: 'video', src: `${P}/la-tarara.mp4` },
      },
    ],
    derecha: [],
    notas: {
      sello: `${P}/cannes.svg`,
      texto: {
        es: 'Un encargo de ICEX para enseñar al mundo el talento audiovisual español. Raíces clásicas y un pulso moderno, en rojo carmín y oro. Estreno en el Festival de Cannes.',
        en: 'A commission from ICEX to show the world what Spanish film-making can do. Classical roots with a modern pulse, in crimson and gold. Premiered at the Cannes Film Festival.',
        zh: 'ICEX 委托的作品，向世界展示西班牙影视人才的实力。古典的根基，现代的脉搏，配上胭脂红与金色。在戛纳电影节首映。',
      },
      enlace: {
        href: 'https://spainwheretalentignites.com/la-tarara',
        texto: { es: 'Ver la película completa ↗', en: 'Watch the full film ↗', zh: '观看完整影片 ↗' },
      },
    },
  },
  {
    tema: 'airbnb',
    nombre: igual('AIRBNB'),
    rotulo: { es: 'RAÍCES', en: 'ROOTS', zh: '根源' },
    izquierda: [
      {
        id: 'airbnb',
        etiqueta: igual('AIRBNB'),
        titulo: igual('Roots & Heritage'),
        detalle: {
          es: 'Airbnb · Campaña global · Música original',
          en: 'Airbnb · Global campaign · Original music',
          zh: 'Airbnb · 全球广告活动 · 原创音乐',
        },
        portada: `${P}/airbnb-roots.webp`,
        galleta: '#ff5a5f',
        logo: `${L}/airbnb.png`,
        medio: { tipo: 'vimeo', id: '1200890612' },
      },
    ],
    derecha: [],
    notas: {
      fondo: `${P}/chimenea.webp`,
      texto: {
        es: 'Un homenaje acústico a la España rural: maderas, cuerdas íntimas y el calor de juntarse alrededor del fuego.',
        en: 'An acoustic tribute to rural Spain: woodwinds, intimate strings and the warmth of gathering around the fire.',
        zh: '献给西班牙乡村的原声致敬：木管、细腻的弦乐，还有围着炉火相聚的温暖。',
      },
    },
  },
  {
    tema: 'paula',
    nombre: { es: 'PUBLI', en: 'ADS', zh: '广告' },
    rotulo: { es: 'PUBLICIDAD', en: 'ADVERTISING', zh: '广告作品' },
    izquierda: [
      {
        id: 'custo',
        etiqueta: igual('CUSTO BARCELONA'),
        titulo: igual('Custo Barcelona'),
        detalle: { es: 'Moda · Anuncio vertical', en: 'Fashion · Vertical spot', zh: '时尚 · 竖屏广告' },
        portada: `${P}/custo.webp`,
        // El magenta de la marca, sacado de su propio cierre
        galleta: '#E2009F',
        logo: `${L}/custo.png`,
        // Grabado en vertical: el monitor se convierte en un móvil
        medio: { tipo: 'video', src: `${P}/custo.mp4`, vertical: true },
      },
      {
        id: 'perfume',
        etiqueta: { es: 'PERFUME', en: 'PERFUME', zh: '香水' },
        titulo: { es: 'Perfume', en: 'Perfume', zh: '香水' },
        detalle: { es: 'Campaña · Música original', en: 'Campaign · Original music', zh: '广告活动 · 原创音乐' },
        portada: `${P}/perfume.webp`,
        galleta: '#c9a24a',
        medio: { tipo: 'video', src: `${P}/perfume.mp4` },
      },
    ],
    derecha: [
      {
        id: 'port-adriano',
        etiqueta: igual('PORT ADRIANO'),
        titulo: igual('Port Adriano'),
        detalle: { es: 'Campaña · Música original', en: 'Campaign · Original music', zh: '广告活动 · 原创音乐' },
        portada: `${P}/port-adriano.webp`,
        galleta: '#2f7f9e',
        medio: { tipo: 'video', src: `${P}/port-adriano.mp4` },
      },
      {
        id: 'gym',
        etiqueta: { es: 'GYM', en: 'GYM', zh: '健身房' },
        titulo: { es: 'Gimnasio', en: 'Gym', zh: '健身房' },
        detalle: { es: 'Campaña · Música original', en: 'Campaign · Original music', zh: '广告活动 · 原创音乐' },
        portada: `${P}/gym.webp`,
        galleta: '#8c1c13',
        medio: { tipo: 'video', src: `${P}/gym.mp4` },
      },
    ],
  },
  {
    tema: 'publicidad',
    nombre: { es: 'MARCAS', en: 'BRANDS', zh: '品牌' },
    rotulo: { es: 'MARCAS', en: 'BRANDS', zh: '品牌' },
    izquierda: [
      {
        id: 'movistar-batido',
        etiqueta: igual('MOVISTAR'),
        titulo: { es: 'Batido', en: 'Milkshake', zh: '奶昔' },
        detalle: {
          es: 'Movistar · Es por la Roja · Spot 2025',
          en: 'Movistar · Es por la Roja · 2025 commercial',
          zh: 'Movistar · Es por la Roja · 2025 年广告',
        },
        portada: `${P}/movistar-batido.webp`,
        galleta: '#019df4',
        logo: `${L}/movistar.png`,
        medio: { tipo: 'vimeo', id: '1195977095' },
      },
      {
        id: 'skoda-navidad',
        etiqueta: igual('ŠKODA'),
        titulo: { es: 'Navidad 2026', en: 'Christmas 2026', zh: '2026 圣诞' },
        detalle: { es: 'Škoda · Spot 2026', en: 'Škoda · 2026 commercial', zh: 'Škoda · 2026 年广告' },
        portada: `${P}/skoda-navidad.webp`,
        galleta: '#4ba82e',
        logo: `${L}/skoda.png`,
        medio: { tipo: 'vimeo', id: '1154287399' },
      },
      {
        id: 'casa-tarradellas',
        etiqueta: igual('CASA TARRADELLAS'),
        titulo: igual('In Fraganti'),
        detalle: { es: 'Casa Tarradellas · Spot 2025', en: 'Casa Tarradellas · 2025 commercial', zh: 'Casa Tarradellas · 2025 年广告' },
        portada: `${P}/casa-tarradellas.webp`,
        galleta: '#c8102e',
        logo: `${L}/casa-tarradellas.png`,
        medio: { tipo: 'vimeo', id: '1192277273' },
      },
      {
        id: 'trato-andaluz',
        etiqueta: { es: 'JUNTA DE ANDALUCÍA', en: 'ANDALUSIA', zh: '安达卢西亚' },
        titulo: { es: 'El Trato Andaluz', en: 'The Andalusian Deal', zh: '安达卢西亚式款待' },
        detalle: {
          es: 'Turismo de Andalucía · Campaña 2025',
          en: 'Andalusia Tourism · 2025 campaign',
          zh: '安达卢西亚旅游局 · 2025 年广告活动',
        },
        portada: `${P}/trato-andaluz.webp`,
        galleta: '#007a33',
        logo: `${L}/junta-andalucia.png`,
        medio: { tipo: 'vimeo', id: '1145955458' },
      },
    ],
    derecha: [
      {
        id: 'adolfo-dominguez',
        etiqueta: igual('ADOLFO DOMÍNGUEZ'),
        titulo: { es: 'Impermeable', en: 'Raincoat', zh: '雨衣' },
        detalle: { es: 'Adolfo Domínguez · Spot 2025', en: 'Adolfo Domínguez · 2025 commercial', zh: 'Adolfo Domínguez · 2025 年广告' },
        portada: `${P}/adolfo-dominguez-impermeable.webp`,
        galleta: '#2b2b2b',
        medio: { tipo: 'vimeo', id: '1131715408' },
      },
      {
        id: 'dia',
        etiqueta: igual('DIA'),
        titulo: { es: 'En serio, muy bien', en: 'Seriously, very good', zh: '说真的，很好' },
        detalle: { es: 'DIA · Spot 2026', en: 'DIA · 2026 commercial', zh: 'DIA · 2026 年广告' },
        portada: `${P}/dia.webp`,
        galleta: '#e30613',
        logo: `${L}/dia.png`,
        medio: { tipo: 'vimeo', id: '1190131920' },
      },
      {
        id: 'eroski',
        etiqueta: igual('EROSKI'),
        titulo: { es: '¿Quieres ahorrar conmigo?', en: 'Want to save with me?', zh: '想和我一起省钱吗？' },
        detalle: { es: 'Eroski · Spot 2025', en: 'Eroski · 2025 commercial', zh: 'Eroski · 2025 年广告' },
        portada: `${P}/eroski.webp`,
        galleta: '#e2001a',
        logo: `${L}/eroski.png`,
        medio: { tipo: 'vimeo', id: '1177732189' },
      },
      {
        id: 'freixenet',
        etiqueta: igual('FREIXENET'),
        titulo: igual('Freixenet × Laura Escanes'),
        detalle: { es: 'Freixenet · Campaña digital', en: 'Freixenet · Digital campaign', zh: 'Freixenet · 数字广告活动' },
        portada: `${P}/freixenet-laura-escanes.webp`,
        galleta: '#c9a24a',
        logo: `${L}/freixenet.png`,
        medio: { tipo: 'video', src: `${P}/freixenet.mp4` },
      },
    ],
  },
  {
    tema: 'obra',
    nombre: { es: 'OBRA', en: 'OURS', zh: '原创' },
    rotulo: { es: 'OBRA PROPIA', en: 'OUR OWN WORK', zh: '原创作品' },
    izquierda: [
      {
        id: 'caprice-espagnole',
        etiqueta: igual('CAPRICE ESPAGNOLE'),
        titulo: igual('Caprice Espagnole'),
        detalle: {
          es: 'Obra original · Grabada en Power Station, Nueva York',
          en: 'Original work · Recorded at Power Station, New York',
          zh: '原创作品 · 录制于纽约 Power Station',
        },
        portada: `${P}/caprice-espagnole.webp`,
        galleta: '#c9a24a',
        medio: { tipo: 'vimeo', id: '1190280142' },
      },
      {
        id: 'komorebi',
        etiqueta: igual('KOMOREBI'),
        titulo: igual('Komorebi'),
        detalle: {
          es: 'Obra original · Finalista en el concurso de Red Bull',
          en: 'Original work · Finalist in the Red Bull contest',
          zh: '原创作品 · 红牛比赛决赛入围',
        },
        portada: `${P}/komorebi.webp`,
        galleta: '#7d8f86',
        medio: { tipo: 'audio', src: `${P}/komorebi.mp3` },
      },
      {
        id: 'la-nina-del-vals',
        etiqueta: igual('LA NIÑA DEL VALS'),
        titulo: igual('La Niña del Vals'),
        detalle: { es: 'Obra original · Cuerdas', en: 'Original work · Strings', zh: '原创作品 · 弦乐' },
        portada: `${P}/la-nina-del-vals.webp`,
        galleta: '#8a6a9e',
        medio: { tipo: 'audio', src: `${P}/la-nina-del-vals.mp3` },
      },
    ],
    derecha: [
      {
        id: 'larghetto',
        etiqueta: igual('LARGHETTO'),
        titulo: igual('Larghetto'),
        detalle: { es: 'Obra original · Orquesta', en: 'Original work · Orchestra', zh: '原创作品 · 管弦乐' },
        portada: `${P}/larghetto.webp`,
        galleta: '#b5763a',
        medio: { tipo: 'audio', src: `${P}/larghetto.mp3` },
      },
      {
        id: 'thriller',
        etiqueta: igual('THRILLER'),
        titulo: igual('Thriller'),
        detalle: { es: 'Obra original · Tensión', en: 'Original work · Tension', zh: '原创作品 · 张力' },
        portada: `${P}/thriller.webp`,
        galleta: '#8c1c13',
        medio: { tipo: 'audio', src: `${P}/thriller.mp3` },
      },
    ],
  },
];
