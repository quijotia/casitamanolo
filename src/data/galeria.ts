// Las mesas de la galería y las servilletas que hay encima.
//
// Aquí solo se enseña trabajo: la sesión de cuerdas, la partitura. Nada de
// retratos: una foto de estudio sin pie que la explique no cuenta a qué se
// dedica la casa, y las personales se leen como otra cosa.
//
// Las que no se enseñan siguen aquí abajo con `oculta: true`, para cuando
// haya más fotos de sesión con las que montar una segunda mesa: se les quita
// la marca y vuelven. Lo mismo con las mesas enteras.
//
// Si una foto todavía no existe, la servilleta enseña el hueco "FOTO
// PENDIENTE" en vez de una imagen rota: basta con dejar el archivo en
// public/images para que aparezca.

import type { Texto } from '../i18n/config';

export type Tinta = 'azul' | 'rojo';

export interface Servilleta {
    foto: string;
    categoria: Texto;
    descripcion: Texto;
    tinta: Tinta;
    /** Giro sobre la mesa en reposo y al abrirla, en grados */
    giro: [number, number];
    /** Desplazamiento vertical dentro de su hueco, para que no queden alineadas */
    dy: number;
    /** Qué parte de la foto se ve en el hueco (background-position) */
    foco?: string;
    /** Guardada en el cajón: no se pinta, pero no se pierde */
    oculta?: boolean;
}

export interface Mesa {
    id: 'vermut' | 'cafe' | 'sobremesa';
    nombre: Texto;
    servilletas: Servilleta[];
    /** Recogida: la mesa no se pone hasta que haya fotos que llevarle */
    oculta?: boolean;
}

const todas: Mesa[] = [
    {
        id: 'vermut',
        nombre: { es: 'El vermut', en: 'The vermouth', zh: '开胃酒时间' },
        servilletas: [
            {
                foto: '/images/sesion-cuerdas.jpg',
                categoria: { es: 'LA SESIÓN', en: 'THE SESSION', zh: '录音' },
                descripcion: {
                    es: 'Cuerdas grabando en el estudio: la música se toca, no se teclea',
                    en: 'Strings recording at the studio: the music is played, not typed',
                    zh: '弦乐在录音棚里录制：音乐是演奏出来的，不是敲键盘敲出来的',
                },
                tinta: 'rojo', giro: [-8, -2], dy: -16, foco: 'center 45%',
            },
            {
                foto: '/images/paula-partitura.jpg',
                categoria: { es: 'LA PARTITURA', en: 'THE SCORE', zh: '乐谱' },
                descripcion: {
                    es: 'A lápiz y a mano, antes de que entre nadie a grabar',
                    en: 'In pencil, by hand, before anyone walks in to record',
                    zh: '用铅笔手写，在任何人进棚录音之前',
                },
                tinta: 'azul', giro: [10, 2], dy: 18, foco: '38% center',
            },
            {
                foto: '/images/paula-retrato.jpg',
                categoria: { es: 'ENTRE TOMA Y TOMA', en: 'BETWEEN TAKES', zh: '录音间隙' },
                descripcion: {
                    es: 'Un alto en el estudio, con la grabación a medias',
                    en: 'A break in the studio, halfway through the session',
                    zh: '录音棚里歇一会儿，录音才进行到一半',
                },
                tinta: 'rojo', giro: [11, 2], dy: 22, foco: 'center 38%', oculta: true,
            },
            {
                foto: '/images/paula-ventana.jpg',
                categoria: { es: 'LUZ DE VENTANA', en: 'WINDOW LIGHT', zh: '窗边的光' },
                descripcion: {
                    es: 'Paula en una sesión de retrato en el estudio',
                    en: 'Paula during a portrait session at the studio',
                    zh: 'Paula 在录音棚拍摄肖像',
                },
                tinta: 'azul', giro: [-5, 3], dy: -6, foco: '58% 45%', oculta: true,
            },
        ],
    },
    {
        id: 'cafe',
        nombre: { es: 'El café', en: 'The coffee', zh: '咖啡时间' },
        oculta: true,
        servilletas: [
            {
                foto: '/images/paula-pausa.jpg',
                categoria: { es: 'LA PAUSA', en: 'THE PAUSE', zh: '歇一会儿' },
                descripcion: {
                    es: 'La casa también se para a mirar por la ventana',
                    en: 'The house stops to look out of the window too',
                    zh: '这座房子也会停下来，看看窗外',
                },
                tinta: 'rojo', giro: [-7, -3], dy: 20, foco: '55% 35%', oculta: true,
            },
            {
                foto: '/images/paula-contraluz.jpg',
                categoria: { es: 'A CONTRALUZ', en: 'AGAINST THE LIGHT', zh: '逆光' },
                descripcion: {
                    es: 'Retrato de Paula, mitad de la casa junto a Víctor',
                    en: 'A portrait of Paula, half of the house alongside Víctor',
                    zh: 'Paula 的肖像，她和 Víctor 各是这个家的一半',
                },
                tinta: 'azul', giro: [13, 1], dy: -16, foco: 'center 35%', oculta: true,
            },
        ],
    },
    {
        id: 'sobremesa',
        nombre: { es: 'La sobremesa', en: 'After dinner', zh: '饭后闲谈' },
        oculta: true,
        servilletas: [
            {
                foto: '/images/victor-dirigiendo.jpg',
                categoria: { es: 'DIRIGIENDO', en: 'CONDUCTING', zh: '指挥' },
                descripcion: {
                    es: 'Víctor, cofundador de Casita Manolo, dirigiendo una sesión de grabación',
                    en: 'Víctor, co-founder of Casita Manolo, conducting a recording session',
                    zh: 'Víctor，Casita Manolo 的联合创始人，正在指挥一场录音',
                },
                tinta: 'rojo', giro: [-8, -2], dy: -14, foco: '52% 40%', oculta: true,
            },
            {
                foto: '/images/victor-partitura.jpg',
                categoria: { es: 'SOBRE LA PARTITURA', en: 'OVER THE SCORE', zh: '对着乐谱' },
                descripcion: {
                    es: 'Repasando la partitura entre dos tomas',
                    en: 'Going over the score between takes',
                    zh: '两条录音之间，再把乐谱过一遍',
                },
                tinta: 'azul', giro: [10, 2], dy: 18, foco: '55% 35%', oculta: true,
            },
            {
                foto: '/images/victor-mesa.jpg',
                categoria: { es: 'LA MESA DE MEZCLAS', en: 'THE MIXING DESK', zh: '调音台' },
                descripcion: {
                    es: 'En la mesa del estudio, donde se decide cómo suena todo',
                    en: 'At the studio desk, where how it all sounds gets decided',
                    zh: '在录音棚的调音台前，一切听起来怎样，都在这里决定',
                },
                tinta: 'rojo', giro: [-5, 3], dy: -4, foco: 'center 55%', oculta: true,
            },
        ],
    },
];

/** Lo que se pone en la sala: las mesas y las servilletas sin recoger. */
export const mesas: Mesa[] = todas
    .filter((mesa) => !mesa.oculta)
    .map((mesa) => ({ ...mesa, servilletas: mesa.servilletas.filter((s) => !s.oculta) }));
