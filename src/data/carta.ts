// La carta de la casa: lo que se compone aquí, escrito como un menú.
// El precio va en la pizarra como "S/M", según mercado.

import type { Texto } from '../i18n/config';

export type Curso = 'primeros' | 'segundos' | 'postres';

export interface Plato {
    curso: Curso;
    nombre: Texto;
    descripcion: Texto;
}

export const platos: Plato[] = [
    {
        curso: 'primeros',
        nombre: { es: 'Identidad Sonora', en: 'Sonic Identity', zh: '声音标识' },
        descripcion: {
            es: 'El logo de tu marca, pero para el oído.',
            en: "Your brand's logo, but for the ear.",
            zh: '品牌的标志，只不过是给耳朵听的。',
        },
    },
    {
        curso: 'primeros',
        nombre: { es: 'Supervisión Musical', en: 'Music Supervision', zh: '音乐监制' },
        descripcion: {
            es: 'Buscamos, negociamos y licenciamos el tema que pide la escena.',
            en: 'We find, negotiate and license the track the scene is asking for.',
            zh: '为场景找到它需要的那首歌，谈下来，拿到授权。',
        },
    },
    {
        curso: 'segundos',
        nombre: { es: 'Banda Sonora Original', en: 'Original Score', zh: '原创配乐' },
        descripcion: {
            es: 'Score a medida para largo, corto o serie. De piano solo a orquesta.',
            en: 'A score made to measure for a feature, a short or a series. From solo piano to full orchestra.',
            zh: '为长片、短片或剧集量身定制配乐。从钢琴独奏到整支管弦乐团。',
        },
    },
    {
        curso: 'segundos',
        nombre: { es: 'Música para Spot', en: 'Music for Commercials', zh: '广告音乐' },
        descripcion: {
            es: 'Composición original para campaña, con todos sus cortes y duraciones.',
            en: 'Original composition for the campaign, with every cutdown and length.',
            zh: '为广告活动原创作曲，各种剪辑版本和时长一应俱全。',
        },
    },
    {
        curso: 'postres',
        nombre: { es: 'Grabación y Arreglos', en: 'Recording & Arrangements', zh: '录音与编曲' },
        descripcion: {
            es: 'Músicos de sesión, cuerdas y metales. Aquí se toca de verdad.',
            en: "Session players, strings and brass. Here it's actually played.",
            zh: '录音乐手、弦乐和铜管。在这里，音乐是真的演奏出来的。',
        },
    },
    {
        curso: 'postres',
        nombre: { es: 'Diseño Sonoro y Mezcla', en: 'Sound Design & Mix', zh: '声音设计与混音' },
        descripcion: {
            es: 'Ambientes, foley y mezcla final. Nosotros recogemos la mesa.',
            en: 'Ambiences, foley and the final mix. We clear the table.',
            zh: '环境声、拟音和最终混音。最后由我们来收桌子。',
        },
    },
];
