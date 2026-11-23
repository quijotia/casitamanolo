import type { Texto } from '../i18n/config';

export interface Client {
  id: string;
  /** El nombre de la marca no se traduce */
  name: string;
  category: Texto;
  surface: 'white' | 'black' | 'kraft';
  /** Logo de la marca impreso en el posavasos; sin él va el nombre en letra */
  logo?: string;
  project?: {
    title: Texto;
    year?: string;
    role: Texto;
    summary: Texto;
    audio?: string;
    video?: string;
    poster?: string;
  };
}

const musicaOriginal: Texto = { es: 'Música original', en: 'Original music', zh: '原创音乐' };
const spotTv: Texto = { es: 'Spot TV', en: 'TV commercial', zh: '电视广告' };
const institucional: Texto = { es: 'Institucional', en: 'Institutional', zh: '机构宣传' };

// Marcas con las que ha trabajado Casita Manolo. Los proyectos coinciden con
// los del archivo musical (src/data/portfolio.ts); las marcas sin proyecto
// publicable todavía muestran la ficha como pendiente.
export const clients: Client[] = [
  {
    id: 'movistar', name: 'MOVISTAR', category: spotTv, surface: 'black', logo: '/portfolio/logos/movistar.png',
    project: {
      title: { es: 'Batido', en: 'Milkshake', zh: '奶昔' }, year: '2025', role: musicaOriginal,
      summary: {
        es: 'Campaña de Movistar con la Selección Española: «Es por la Roja».',
        en: 'Movistar campaign with the Spanish national team: “Es por la Roja”.',
        zh: 'Movistar 与西班牙国家队合作的广告：“Es por la Roja”。',
      },
    },
  },
  {
    id: 'airbnb', name: 'AIRBNB', category: { es: 'Campaña global', en: 'Global campaign', zh: '全球广告活动' }, surface: 'white', logo: '/portfolio/logos/airbnb.png',
    project: {
      title: { es: 'Roots & Heritage', en: 'Roots & Heritage', zh: 'Roots & Heritage' }, role: musicaOriginal,
      summary: {
        es: 'Un homenaje acústico a la España rural: maderas, cuerdas íntimas y el calor de juntarse alrededor del fuego.',
        en: 'An acoustic tribute to rural Spain: woodwinds, intimate strings and the warmth of gathering around the fire.',
        zh: '献给西班牙乡村的原声致敬：木管、细腻的弦乐，还有围着炉火相聚的温暖。',
      },
    },
  },
  {
    id: 'icex', name: 'ICEX', category: institucional, surface: 'black', logo: '/portfolio/logos/icex.png',
    project: {
      title: { es: 'La Tarara', en: 'La Tarara', zh: 'La Tarara' },
      role: { es: 'Banda sonora original', en: 'Original score', zh: '原创配乐' },
      summary: {
        es: 'Spain, Where Talent Ignites: el talento audiovisual español presentado al mundo, con estreno en el Festival de Cannes.',
        en: 'Spain, Where Talent Ignites: Spanish film-making introduced to the world, premiered at the Cannes Film Festival.',
        zh: 'Spain, Where Talent Ignites：向世界展示西班牙的影视人才，在戛纳电影节首映。',
      },
      video: '/portfolio/la-tarara.mp4', poster: '/portfolio/la-tarara.webp',
    },
  },
  {
    id: 'freixenet', name: 'FREIXENET', category: { es: 'Campaña digital', en: 'Digital campaign', zh: '数字广告活动' }, surface: 'black', logo: '/portfolio/logos/freixenet.png',
    project: {
      title: { es: 'Freixenet × Laura Escanes', en: 'Freixenet × Laura Escanes', zh: 'Freixenet × Laura Escanes' }, role: musicaOriginal,
      summary: {
        es: 'Orquesta de cine con una estética fresca para una campaña digital.',
        en: 'A film orchestra with a fresh look, for a digital campaign.',
        zh: '电影级的管弦乐，配上清新的风格，为一次数字广告活动而作。',
      },
      video: '/portfolio/freixenet.mp4', poster: '/portfolio/freixenet-laura-escanes.webp',
    },
  },
  {
    id: 'skoda', name: 'ŠKODA', category: spotTv, surface: 'kraft', logo: '/portfolio/logos/skoda.png',
    project: {
      title: { es: 'Navidad 2026', en: 'Christmas 2026', zh: '2026 圣诞' }, year: '2026', role: musicaOriginal,
      summary: { es: 'La campaña de Navidad de Škoda.', en: 'Škoda’s Christmas campaign.', zh: 'Škoda 的圣诞广告。' },
    },
  },
  {
    id: 'seleccion-espanola', name: 'SELECCIÓN ESPAÑOLA', category: { es: 'Fútbol', en: 'Football', zh: '足球' }, surface: 'kraft', logo: '/portfolio/logos/seleccion-espanola.png',
    project: {
      title: { es: 'Es por la Roja', en: 'Es por la Roja', zh: 'Es por la Roja' }, year: '2025', role: musicaOriginal,
      summary: {
        es: 'Campaña de Movistar con la Selección Española.',
        en: 'Movistar campaign with the Spanish national team.',
        zh: 'Movistar 与西班牙国家队合作的广告。',
      },
    },
  },
  {
    id: 'casa-tarradellas', name: 'CASA TARRADELLAS', category: spotTv, surface: 'white', logo: '/portfolio/logos/casa-tarradellas.png',
    project: {
      title: { es: 'In Fraganti', en: 'In Fraganti', zh: 'In Fraganti' }, year: '2025', role: musicaOriginal,
      summary: { es: 'Spot de Casa Tarradellas.', en: 'Casa Tarradellas commercial.', zh: 'Casa Tarradellas 的广告。' },
    },
  },
  {
    id: 'custo', name: 'CUSTO BARCELONA', category: { es: 'Moda', en: 'Fashion', zh: '时尚' }, surface: 'white', logo: '/portfolio/logos/custo.png',
    project: {
      title: { es: 'Anuncio vertical', en: 'Vertical spot', zh: '竖屏广告' }, role: musicaOriginal,
      summary: {
        es: 'Pieza de moda para redes, grabada en vertical: los estampados de la casa a toda velocidad y una música que aguanta el ritmo del montaje.',
        en: 'A fashion piece for social, shot vertical: the label’s prints at full speed and a track that keeps up with the cut.',
        zh: '为社交媒体拍摄的竖屏时尚短片：品牌的印花飞速闪过，音乐紧跟剪辑的节奏。',
      },
      video: '/portfolio/custo.mp4', poster: '/portfolio/custo.webp',
    },
  },
  {
    id: 'adolfo-dominguez', name: 'ADOLFO DOMÍNGUEZ', category: { es: 'Moda', en: 'Fashion', zh: '时尚' }, surface: 'black',
    project: {
      title: { es: 'Impermeable', en: 'Raincoat', zh: '雨衣' }, year: '2025', role: musicaOriginal,
      summary: { es: 'Spot de Adolfo Domínguez.', en: 'Adolfo Domínguez commercial.', zh: 'Adolfo Domínguez 的广告。' },
    },
  },
  {
    id: 'junta-andalucia', name: 'JUNTA DE ANDALUCÍA', category: institucional, surface: 'white', logo: '/portfolio/logos/junta-andalucia.png',
    project: {
      title: { es: 'El Trato Andaluz', en: 'The Andalusian Deal', zh: '安达卢西亚式款待' }, year: '2025', role: musicaOriginal,
      summary: {
        es: 'Campaña institucional de la Junta de Andalucía.',
        en: 'Institutional campaign for the regional government of Andalusia.',
        zh: '安达卢西亚自治区政府的宣传广告。',
      },
    },
  },
  {
    id: 'dia', name: 'DIA', category: spotTv, surface: 'kraft', logo: '/portfolio/logos/dia.png',
    project: {
      title: { es: 'En serio, muy bien', en: 'Seriously, very good', zh: '说真的，很好' }, year: '2026', role: musicaOriginal,
      summary: { es: 'Spot de DIA.', en: 'DIA commercial.', zh: 'DIA 的广告。' },
    },
  },
  {
    id: 'eroski', name: 'EROSKI', category: spotTv, surface: 'white', logo: '/portfolio/logos/eroski.png',
    project: {
      title: { es: '¿Quieres ahorrar conmigo?', en: 'Want to save with me?', zh: '想和我一起省钱吗？' }, year: '2025', role: musicaOriginal,
      summary: { es: 'Campaña de Eroski.', en: 'Eroski campaign.', zh: 'Eroski 的广告。' },
    },
  },
  { id: 'ministerio-cultura', name: 'MINISTERIO DE CULTURA', category: institucional, surface: 'kraft' },
  { id: 'abante', name: 'ABANTE', category: { es: 'Marca', en: 'Brand', zh: '品牌' }, surface: 'black' },
];
