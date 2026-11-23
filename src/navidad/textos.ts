// Los textos del disfraz de Navidad, en todos los idiomas de la casa. Como en
// src/i18n/textos.ts: si falta un idioma, el build no pasa.
import type { Texto } from '../i18n/config';

export const textosNavidad = {
    edicion: { es: 'Edición Navidad', en: 'Christmas edition', zh: '圣诞特别版' },
    feliz: { es: '¡Feliz Navidad!', en: 'Merry Christmas!', zh: '圣诞快乐！' },
    sonidoSi: { es: 'Sorpresas con sonido', en: 'Surprises with sound', zh: '惊喜带声音' },
    sonidoNo: { es: 'Sorpresas sin sonido', en: 'Silent surprises', zh: '惊喜不带声音' },
    sonidoAria: { es: 'Activar o silenciar el sonido de las sorpresas', en: 'Turn the surprise sounds on or off', zh: '打开或关闭惊喜的声音' },
    estrella: { es: 'La estrella. Pide un deseo', en: 'The star. Make a wish', zh: '星星。许个愿吧' },
    deseo: { es: 'Deseo pedido. Que se cumpla', en: 'Wish made. May it come true', zh: '愿望已许下，愿它成真' },
    tejadoRegalos: { es: 'Hay regalos en el ático…', en: 'There are presents in the attic…', zh: '阁楼里有礼物……' },
    ticketRegalo: { es: '1x TURRÓN DE LA CASA', en: '1x HOUSE TURRÓN', zh: '1x 本店牛轧糖' },
    ticketGratis: { es: 'GRATIS', en: 'FREE', zh: '免费' },
    pizarra: { es: '¡Felices fiestas!', en: 'Happy holidays!', zh: '节日快乐！' },
} satisfies Record<string, Texto>;
