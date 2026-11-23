// Los textos del disfraz, en todos los idiomas de la casa. Como en
// src/i18n/textos.ts: si falta un idioma, el build no pasa.
import type { Texto } from '../i18n/config';

export const textosHalloween = {
    edicion: { es: 'Edición Halloween', en: 'Halloween edition', zh: '万圣节特别版' },
    bu: { es: '¡BUUU!', en: 'BOO!', zh: '哇——！' },
    sonidoSi: { es: 'Sustos con sonido', en: 'Scares with sound', zh: '惊吓带声音' },
    sonidoNo: { es: 'Sustos sin sonido', en: 'Silent scares', zh: '惊吓不带声音' },
    sonidoAria: { es: 'Activar o silenciar el sonido de los sustos', en: 'Turn the scare sounds on or off', zh: '打开或关闭惊吓的声音' },
    luna: { es: 'La luna. Tócala, si te atreves', en: 'The moon. Touch it, if you dare', zh: '月亮。敢碰就碰一下' },
    tejadoOtraVez: { es: 'Algo vive en el ático…', en: 'Something lives in the attic…', zh: '阁楼里住着什么东西……' },
    ticketSusto: { es: '1x SUSTO DE LA CASA', en: '1x HOUSE SCARE', zh: '1x 本店惊吓' },
    ticketGratis: { es: 'GRATIS', en: 'FREE', zh: '免费' },
    pizarraBu: { es: '¡Bu!', en: 'Boo!', zh: '哇！' },
} satisfies Record<string, Texto>;
