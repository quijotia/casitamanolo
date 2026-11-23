// La bandera de cada idioma.
//
// Van dibujadas a línea, como el resto de la casa: fondo crema, trazo verde
// oscuro y los colores planos dentro. Nada de banderas fotográficas, que a
// 20px se convierten en una mancha.
//
// Al añadir un idioma hay que darle su bandera aquí y dibujarla en
// src/components/Idiomas.astro (TypeScript avisa de lo primero).

import type { Idioma } from './config';

export interface Bandera {
    /** Cómo se llama el idioma en su propio idioma */
    nombre: string;
    /** Las dos letras que se leen en el chip */
    codigo: string;
    /** Qué bandera se dibuja */
    pais: 'es' | 'us' | 'cn';
}

export const banderas: Record<Idioma, Bandera> = {
    es: { nombre: 'Español', codigo: 'ES', pais: 'es' },
    en: { nombre: 'English', codigo: 'EN', pais: 'us' },
    zh: { nombre: '中文', codigo: '中文', pais: 'cn' },
};
