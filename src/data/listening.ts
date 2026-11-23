import type { Texto } from '../i18n/config';

// La radio de la casa: un mismo anuncio y cuatro músicas para él. El dial no
// cambia de canción, cambia de qué va la escena. Es la demostración más corta
// de a qué se dedica una casa de música.
//
// Cada pista dura lo mismo que el vídeo, así que al girar el dial la música
// entra por donde va la imagen.
export const moods = [
  { id: 'orquesta', name: 'Orquesta', number: '01', title: 'Cuerdas y cine', description: 'Cuerdas, madera y aire: la escena se vuelve una película.', source: '/sounds/anuncio-orquesta.mp3' },
  { id: 'rnb', name: 'R&B', number: '02', title: 'Groove y terciopelo', description: 'Bajo redondo y caja perezosa. La misma imagen, con otra cadera.', source: '/sounds/anuncio-rnb.mp3' },
  { id: 'house', name: 'House', number: '03', title: 'Cuatro por cuatro', description: 'El bombo entra y el anuncio se va de noche.', source: '/sounds/anuncio-house.mp3' },
  { id: 'soft-rock', name: 'Soft Rock', number: '04', title: 'Guitarras y tarde', description: 'Guitarras limpias y un aire de sábado por la tarde.', source: '/sounds/anuncio-soft-rock.mp3' },
] as const;

export type MoodId = (typeof moods)[number]['id'];

// Las mismas emisoras en los idiomas de la casa. Las usa el televisor del
// home (src/components/RadioTV.astro), que es el único sitio donde suena
// esto: las páginas sueltas /radio y /television eran una versión anterior,
// solo en español y sin enlazar, y se han quitado.
export const emisoras: Record<MoodId, { nombre: Texto; titulo: Texto }> = {
  orquesta: {
    nombre: { es: 'Orquesta', en: 'Orchestral', zh: '管弦乐' },
    titulo: { es: 'Cuerdas y cine', en: 'Strings and cinema', zh: '弦乐与电影' },
  },
  rnb: {
    nombre: { es: 'R&B', en: 'R&B', zh: 'R&B' },
    titulo: { es: 'Groove y terciopelo', en: 'Groove and velvet', zh: '律动与丝绒' },
  },
  house: {
    nombre: { es: 'House', en: 'House', zh: 'House' },
    titulo: { es: 'Cuatro por cuatro', en: 'Four on the floor', zh: '四四拍' },
  },
  'soft-rock': {
    nombre: { es: 'Soft Rock', en: 'Soft Rock', zh: 'Soft Rock' },
    titulo: { es: 'Guitarras y tarde', en: 'Guitars and late afternoon', zh: '吉他与午后' },
  },
};

/** La escena que se ve en la pantalla mientras suena el dial */
export const televisionScene = {
  source: '/videos/anuncio.mp4',
  poster: '/videos/anuncio-poster.jpg',
  description: 'Un anuncio de moda: interiores en penumbra, una piscina y la luz de la tarde.',
};

/** La escena, contada en los dos idiomas */
export const escena: { descripcion: Texto; credito: Texto } = {
  descripcion: {
    es: 'Un anuncio de moda: interiores en penumbra, una piscina y la luz de la tarde.',
    en: 'A fashion ad: dim interiors, a swimming pool and late afternoon light.',
    zh: '一支时尚广告：昏暗的室内、一个泳池和午后的光。',
  },
  credito: {
    es: 'El mismo anuncio, cuatro músicas. Gira el dial y compara.',
    en: 'The same ad, four different scores. Turn the dial and compare.',
    zh: '同一支广告，四种音乐。转动旋钮，比较一下。',
  },
};
