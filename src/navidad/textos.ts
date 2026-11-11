// Los textos del disfraz de Navidad, en todos los idiomas de la casa. Como en
// src/i18n/textos.ts: si falta un idioma, el build no pasa.
import type { Texto } from '../i18n/config';

export const textosNavidad = {
    edicion: { es: 'Edición Navidad', en: 'Christmas edition' },
    feliz: { es: '¡Feliz Navidad!', en: 'Merry Christmas!' },
    sonidoSi: { es: 'Sorpresas con sonido', en: 'Surprises with sound' },
    sonidoNo: { es: 'Sorpresas sin sonido', en: 'Silent surprises' },
    sonidoAria: { es: 'Activar o silenciar el sonido de las sorpresas', en: 'Turn the surprise sounds on or off' },
    estrella: { es: 'La estrella. Pide un deseo', en: 'The star. Make a wish' },
    deseo: { es: 'Deseo pedido. Que se cumpla', en: 'Wish made. May it come true' },
    tejadoRegalos: { es: 'Hay regalos en el ático…', en: 'There are presents in the attic…' },
    ticketRegalo: { es: '1x TURRÓN DE LA CASA', en: '1x HOUSE TURRÓN' },
    ticketGratis: { es: 'GRATIS', en: 'FREE' },
    pizarra: { es: '¡Felices fiestas!', en: 'Happy holidays!' },
} satisfies Record<string, Texto>;
