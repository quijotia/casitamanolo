// Idiomas de la casa.
//
// El español vive en la raíz (/portfolio) y los demás bajo su prefijo
// (/en/portfolio). Las páginas están en src/pages/[...idioma]/ y sacan las
// rutas de `rutasDeIdioma()`, así que para añadir un idioma basta con
// meterlo en `idiomas`, traducir src/i18n/textos.ts y los textos de
// src/data: TypeScript se encarga de avisar de todo lo que falte.

export const idiomas = ['es', 'en', 'zh'] as const;
export type Idioma = (typeof idiomas)[number];

export const idiomaPorDefecto: Idioma = 'es';

/** Un texto escrito en todos los idiomas. Falta uno y el build no pasa. */
export type Texto = Record<Idioma, string>;

/** El texto del idioma que se está pintando */
export const t = (texto: Texto, idioma: Idioma) => texto[idioma];

/** Las rutas que genera cada página: una por idioma */
export function rutasDeIdioma() {
    return idiomas.map((idioma) => ({
        // El idioma por defecto no lleva prefijo: el parámetro va vacío
        params: { idioma: idioma === idiomaPorDefecto ? undefined : idioma },
        props: { idioma },
    }));
}

/** Enlace a una página en un idioma: enlace('/portfolio', 'en') → '/en/portfolio' */
export function enlace(destino: string, idioma: Idioma) {
    const limpio = destino === '/' ? '' : destino;
    if (idioma === idiomaPorDefecto) return limpio || '/';
    return `/${idioma}${limpio}`;
}

/** El mismo destino en todos los idiomas, para los <link rel="alternate"> */
export function alternativas(destino: string) {
    return idiomas.map((idioma) => ({ idioma, href: enlace(destino, idioma) }));
}

/** Código de idioma completo, para el atributo lang y para hreflang */
export const codigoLang: Record<Idioma, string> = {
    es: 'es-ES',
    en: 'en-US',
    zh: 'zh-CN',
};
