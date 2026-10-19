// Los textos del disfraz, en todos los idiomas de la casa. Como en
// src/i18n/textos.ts: si falta un idioma, el build no pasa.
import type { Texto } from '../i18n/config';

export const textosHalloween = {
    edicion: { es: 'Edición Halloween', en: 'Halloween edition' },
    bu: { es: '¡BUUU!', en: 'BOO!' },
    sonidoSi: { es: 'Sustos con sonido', en: 'Scares with sound' },
    sonidoNo: { es: 'Sustos sin sonido', en: 'Silent scares' },
    sonidoAria: { es: 'Activar o silenciar el sonido de los sustos', en: 'Turn the scare sounds on or off' },
    luna: { es: 'La luna. Tócala, si te atreves', en: 'The moon. Touch it, if you dare' },
    tejadoOtraVez: { es: 'Algo vive en el ático…', en: 'Something lives in the attic…' },
    ticketSusto: { es: '1x SUSTO DE LA CASA', en: '1x HOUSE SCARE' },
    ticketGratis: { es: 'GRATIS', en: 'FREE' },
    pizarraBu: { es: '¡Bu!', en: 'Boo!' },
} satisfies Record<string, Texto>;
