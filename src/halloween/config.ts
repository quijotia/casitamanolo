// La casa encantada: el disfraz de Halloween de la web.
//
// Todo lo de Halloween vive en esta carpeta. Se enciende solo en las fechas
// de abajo (en la hora del que visita, cada año) y el resto del año la web
// es la de siempre: los estilos solo cuentan cuando <html> lleva
// data-tema="halloween", y eso solo lo pone el script de Halloween.astro.
//
// Para verlo fuera de fechas (o apagarlo para enseñar la normal):
//   /?tema=halloween   → encendido mientras dure la pestaña
//   /?tema=normal      → apagado mientras dure la pestaña
//
// Para quitarlo del todo: borrar esta carpeta y las líneas que la importan
// (busca "halloween" en src/layouts y src/pages).

/** Primer y último día del disfraz, como 'MM-DD'. Los dos entran. */
export const temporada = {
    desde: '10-17',
    hasta: '11-02',
};
