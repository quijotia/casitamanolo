// Los disfraces de la casa por temporada.
//
// Cada tema vive en su carpeta (src/halloween, src/navidad) y solo cuenta
// cuando <html> lleva data-tema="<tema>". Eso lo decide Temas.astro según la
// fecha del que visita, cada año. El resto del año la web es la de siempre.
//
// Para ver uno fuera de fechas (o apagarlos para enseñar la web normal):
//   /?tema=halloween   /?tema=navidad   /?tema=normal
// La elección dura mientras siga abierta la pestaña.
//
// Las fechas son 'MM-DD' y las dos entran. Una temporada puede cruzar el
// año (navidad acaba en enero). Si dos se solapan, gana la primera.

export const temporadas = [
    { tema: 'halloween', desde: '10-17', hasta: '11-02' },
    { tema: 'navidad', desde: '11-25', hasta: '01-06' },
] as const;

export type Tema = (typeof temporadas)[number]['tema'];
