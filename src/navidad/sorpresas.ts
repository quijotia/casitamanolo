// El atrezo de Navidad que no cabe en el CSS, y sus pocas sorpresas: todo
// tranquilo, sin sonidos ni nada que salte a pantalla completa.
//
// Solo hace algo cuando <html data-tema="navidad">. Los escuchadores de
// documento se ponen una vez (este módulo se carga una sola vez aunque el
// Client Router cambie de página); el atrezo se monta en cada astro:page-load
// porque el <body> es nuevo en cada página.
import { navigate } from 'astro:transitions/client';
import { idiomas, idiomaPorDefecto, type Idioma } from '../i18n/config';
import { textosNavidad as N } from './textos';

const raiz = document.documentElement;
const enNavidad = () => raiz.dataset.tema === 'navidad';
const pagina = () => raiz.dataset.pagina ?? '';
const idioma = (): Idioma => {
    const lang = raiz.lang as Idioma;
    return idiomas.includes(lang) ? lang : idiomaPorDefecto;
};
const texto = (clave: keyof typeof N) => N[clave][idioma()];
const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tactil = () => window.matchMedia('(hover: none)').matches;
const azar = (min: number, max: number) => min + Math.random() * (max - min);

/* ==========================================================================
   DIBUJOS QUE SE MONTAN DESDE AQUÍ
   ========================================================================== */
const ESTRELLA5 = 'M 0,-10 L 2.5,-3.4 L 9.5,-3.1 L 4,1.3 L 5.9,8.1 L 0,4.2 L -5.9,8.1 L -4,1.3 L -9.5,-3.1 L -2.5,-3.4 Z';
const COLORES = ['#E23B4E', '#F2C14E', '#3FA66B', '#5AA9E6', '#FFF1D6'];

const vela = `<svg class="nv-vela" viewBox="0 0 46 92" aria-hidden="true">
    <circle cx="23" cy="22" r="20" class="nv-vela-halo" />
    <ellipse cx="23" cy="88" rx="17" ry="3.5" fill="rgba(0,0,0,0.35)" />
    <path d="M13 42 h20 v44 a10 3 0 0 1 -20 0 Z" fill="#C8202F" />
    <path d="M13 42 q2 10 4 2 q3 13 6 3 q2 8 5 0 q2 6 5 -5 Z" fill="#9E1626" />
    <ellipse cx="23" cy="42" rx="10" ry="2.6" fill="#E04454" />
    <line x1="23" y1="42" x2="23" y2="35" stroke="#2a2018" stroke-width="1.6" />
    <g class="nv-llama">
        <path d="M23 12 C 31 23 30 33 23 36 C 16 33 15 23 23 12 Z" fill="#FFD36B" />
        <path d="M23 22 C 26.5 27 26.5 31.5 23 33.5 C 19.5 31.5 19.5 27 23 22 Z" fill="#FF8A2B" />
    </g>
    <g transform="translate(23 85)">
        <path d="M-4 -2 C -12 -10 -18 -4 -21 -1 C -16 -1 -15 3 -10 2 C -10 -1 -6 1 -4 -2 Z" fill="#2E7D4F" stroke="#174A2E" stroke-width="0.8" />
        <path d="M4 -2 C 12 -10 18 -4 21 -1 C 16 -1 15 3 10 2 C 10 -1 6 1 4 -2 Z" fill="#2E7D4F" stroke="#174A2E" stroke-width="0.8" />
        <circle cx="-2" cy="-3" r="2.3" fill="#D7263D" /><circle cx="2.4" cy="-3.6" r="2.3" fill="#D7263D" /><circle cx="0.2" cy="-0.6" r="2.3" fill="#B81D31" />
    </g>
</svg>`;

const arbolito = `<svg class="nv-arbolito" viewBox="-30 -46 60 92" aria-hidden="true">
    <ellipse cx="0" cy="44" rx="22" ry="3.4" fill="rgba(0,0,0,0.35)" />
    <rect x="-5" y="30" width="10" height="13" fill="#6B4226" />
    <path d="M -15,30 L 15,30 L 11,44 L -11,44 Z" fill="#B81D31" />
    <path d="M 0,-34 L 15,-10 L 8,-10 L 21,12 L 12,12 L 26,32 L -26,32 L -12,12 L -21,12 L -8,-10 L -15,-10 Z" fill="#2E7D4F" stroke="#F4EBDD" stroke-width="1.6" stroke-linejoin="round" />
    <path d="M -12,-2 Q 0,6 13,-6 M -18,22 Q 2,30 20,16" fill="none" stroke="#F2C14E" stroke-width="1.6" stroke-linecap="round" />
    ${[[-6, -14, 0], [7, -4, 1], [-10, 6, 2], [4, 10, 3], [14, 22, 4], [-14, 24, 1], [0, 24, 0], [-1, -24, 3]]
        .map(([x, y, c], i) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${COLORES[c]}" class="nv-parpadea" style="--i:${i}" />`).join('')}
    <g transform="translate(0 -36)"><circle r="10" class="nv-vela-halo" /><path d="${ESTRELLA5}" fill="#F2C14E" stroke="#FFF1D6" stroke-width="0.8" transform="scale(0.8)" /></g>
</svg>`;

const regalo = (color: string, cinta: string, giro = 0) => `<svg class="nv-regalo-suelto" style="--giro:${giro}deg" viewBox="-20 -24 40 44" aria-hidden="true">
    <ellipse cx="0" cy="18" rx="17" ry="2.6" fill="rgba(0,0,0,0.35)" />
    <rect x="-15" y="-8" width="30" height="26" fill="${color}" stroke="#F4EBDD" stroke-width="1.4" />
    <rect x="-17" y="-14" width="34" height="8" fill="${color}" stroke="#F4EBDD" stroke-width="1.4" />
    <path d="M 0,-14 L 0,18 M -15,5 L 15,5" stroke="${cinta}" stroke-width="3.4" />
    <path d="M 0,-14 C -6,-24 -14,-20 -9,-15 C -6,-13 -3,-14 0,-14 C 3,-14 6,-13 9,-15 C 14,-20 6,-24 0,-14 Z" fill="${cinta}" />
</svg>`;

const acebo = (giro: number) => `<svg class="nv-acebo" style="--giro:${giro}deg" viewBox="-24 -14 48 26" aria-hidden="true">
    <path d="M-4 -2 C -12 -10 -18 -4 -21 -1 C -16 -1 -15 3 -10 2 C -10 -1 -6 1 -4 -2 Z" fill="#2E7D4F" stroke="#174A2E" stroke-width="0.8" />
    <path d="M4 -2 C 12 -10 18 -4 21 -1 C 16 -1 15 3 10 2 C 10 -1 6 1 4 -2 Z" fill="#2E7D4F" stroke="#174A2E" stroke-width="0.8" />
    <circle cx="-2" cy="-3" r="2.5" fill="#D7263D" /><circle cx="2.6" cy="-3.8" r="2.5" fill="#D7263D" /><circle cx="0.2" cy="-0.4" r="2.5" fill="#B81D31" />
</svg>`;

const bola = (color: string, giro: number) => `<svg class="nv-bola" style="--giro:${giro}deg" viewBox="-14 -18 28 32" aria-hidden="true">
    <rect x="-3.5" y="-15" width="7" height="5" rx="1" fill="#C9A24A" />
    <circle cy="1" r="12" fill="${color}" />
    <path d="M -11,-2 Q 0,4 11,-2" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.6" />
    <ellipse cx="-4.5" cy="-4" rx="3" ry="1.8" fill="rgba(255,255,255,0.5)" transform="rotate(-30 -4.5 -4)" />
</svg>`;

/** Guirnalda de luces de lado a lado, con la comba entre gancho y gancho */
const guirnalda = (ancho: number) => {
    const paso = ancho < 600 ? 46 : 64;
    const n = Math.max(4, Math.round(ancho / paso));
    const sep = ancho / n;
    let cable = `M -10,2`;
    let bombillas = '';
    for (let i = 0; i <= n; i++) {
        const x = i * sep;
        if (i > 0) cable += ` Q ${x - sep / 2},${16} ${x},2`;
        if (i < n) {
            // la bombilla cuelga en el punto más bajo de cada comba
            const bx = x + sep / 2;
            const by = 9;
            bombillas += `<g transform="translate(${bx.toFixed(1)} ${by})"><circle cy="8" r="9" fill="${COLORES[i % 5]}" opacity="0.22" class="nv-parpadea nv-resplandor" style="--i:${i}" /><rect x="-2.4" y="-1" width="4.8" height="3.6" fill="#55657A" /><ellipse cy="8" rx="4.4" ry="6.2" fill="${COLORES[i % 5]}" class="nv-parpadea" style="--i:${i}" /></g>`;
        }
    }
    cable += ` L ${ancho + 10},2`;
    return `<svg viewBox="0 0 ${ancho} 34" width="${ancho}" height="34" aria-hidden="true"><path d="${cable}" fill="none" stroke="#6B7B90" stroke-width="1.6" />${bombillas}</svg>`;
};

/* ==========================================================================
   EL AMBIENTE: nieve que cae y luces arriba, en todas las páginas
   ========================================================================== */
let alRedimensionar: (() => void) | null = null;
const montarAmbiente = () => {
    document.querySelector('.nv-ambiente')?.remove();
    if (alRedimensionar) { window.removeEventListener('resize', alRedimensionar); alRedimensionar = null; }
    if (!enNavidad()) return;

    const capa = document.createElement('div');
    capa.className = 'nv-ambiente';
    capa.setAttribute('aria-hidden', 'true');

    const luces = document.createElement('div');
    luces.className = 'nv-guirnalda';
    luces.innerHTML = guirnalda(window.innerWidth);
    capa.appendChild(luces);

    const copos = document.createElement('div');
    copos.className = 'nv-nevada';
    const cuantos = window.innerWidth < 600 ? 34 : 64;
    let html = '';
    for (let i = 0; i < cuantos; i++) {
        const tam = azar(2, 6.5);
        const dura = azar(9, 19);
        html += `<i class="nv-copo" style="--x:${azar(0, 100).toFixed(1)}vw;--tam:${tam.toFixed(1)}px;--dura:${dura.toFixed(1)}s;--retraso:${(-azar(0, dura)).toFixed(1)}s;--deriva:${azar(-40, 40).toFixed(0)}px;--opacidad:${azar(0.45, 0.95).toFixed(2)}"></i>`;
    }
    copos.innerHTML = html;
    capa.appendChild(copos);
    document.body.appendChild(capa);

    let espera = 0;
    alRedimensionar = () => {
        clearTimeout(espera);
        espera = window.setTimeout(() => { luces.innerHTML = guirnalda(window.innerWidth); }, 200);
    };
    window.addEventListener('resize', alRedimensionar);
};

/* ==========================================================================
   EL TEJADO EN EL MÓVIL
   Sin ratón no hay hover: el toque abre el tejado, salen las estrellas y
   después se entra en clientes.
   ========================================================================== */
let tejadoEnCurso = false;
document.addEventListener('click', (e) => {
    if (!enNavidad() || pagina() !== 'inicio' || !tactil()) return;
    const tejado = (e.target as Element | null)?.closest?.('#roof-clients-link') as HTMLAnchorElement | SVGAElement | null;
    if (!tejado) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (tejadoEnCurso) return;
    tejadoEnCurso = true;
    tejado.classList.add('nv-abierto');
    const estado = document.getElementById('nav-status');
    if (estado) { estado.textContent = texto('tejadoRegalos'); estado.classList.add('active'); }
    const destino = tejado.getAttribute('href') ?? '/';
    setTimeout(() => { tejadoEnCurso = false; navigate(destino); }, sinMovimiento() ? 250 : 1300);
}, true);

/* ==========================================================================
   LA PORTADA: el sello de la edición y la estrella
   ========================================================================== */
const montarPortada = () => {
    if (!enNavidad() || pagina() !== 'inicio') return;

    const marca = document.querySelector('.branding');
    if (marca && !marca.querySelector('.nv-sello')) {
        const sello = document.createElement('p');
        sello.className = 'nv-sello';
        sello.textContent = texto('edicion');
        marca.querySelector('.tagline')?.after(sello);
    }

    // La estrella: al tocarla brilla un momento y te desea suerte
    const estrella = document.getElementById('nv-estrella');
    const pedirDeseo = () => {
        estrella?.classList.remove('nv-brillando');
        void (estrella as unknown as HTMLElement | null)?.getBoundingClientRect();
        estrella?.classList.add('nv-brillando');
        const estado = document.getElementById('nav-status');
        if (estado) {
            estado.textContent = texto('deseo');
            estado.classList.add('active');
            setTimeout(() => {
                if (estado.textContent === texto('deseo')) { estado.classList.remove('active'); estado.textContent = ''; }
            }, 2600);
        }
    };
    estrella?.addEventListener('click', pedirDeseo);
    estrella?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pedirDeseo(); }
    });
};

/* ==========================================================================
   OTRAS PÁGINAS: velas, árboles, regalos y acebo sobre las mesas
   ========================================================================== */
const montarMesas = () => {
    if (!enNavidad()) return;

    const decorar = (dentro: Element | null, clase: string, html: string, alPrincipio = true) => {
        if (!dentro || dentro.querySelector(`.${clase.split(' ')[0]}`)) return;
        const deco = document.createElement('div');
        deco.className = `nv-mesa ${clase}`;
        deco.setAttribute('aria-hidden', 'true');
        deco.innerHTML = html;
        if (alPrincipio) dentro.prepend(deco); else dentro.append(deco);
    };

    if (pagina() === 'clientes') {
        decorar(document.querySelector('.bar-counter'), 'nv-mesa-barra',
            `<div class="nv-sitio nv-sitio-velas">${vela}${vela}</div><div class="nv-sitio nv-sitio-arbolito">${arbolito}</div><div class="nv-sitio nv-sitio-regalos">${regalo('#2E7D4F', '#F2C14E', -6)}${regalo('#C8202F', '#F4EBDD', 8)}</div>`);
    }

    if (pagina() === 'galeria') {
        document.querySelectorAll('.bar-table').forEach((mesa, i) => {
            decorar(mesa, 'nv-mesa-galeria', `
                <div class="nv-sitio nv-sitio-vela">${vela}</div>
                <div class="nv-sitio nv-sitio-bola">${bola(COLORES[(i * 2) % 4], -12 + i * 9)}</div>
                <div class="nv-sitio nv-sitio-acebo">${acebo(-18 + i * 14)}${acebo(160 - i * 20)}</div>`);
        });
    }

    if (pagina() === 'portfolio') {
        decorar(document.querySelector('.mueble'), 'nv-mesa-mueble',
            `<div class="nv-sitio nv-sitio-arbolito">${arbolito}</div><div class="nv-sitio nv-sitio-regalos">${regalo('#C8202F', '#F2C14E', -4)}${regalo('#3FA66B', '#F4EBDD', 6)}</div>`, false);
    }

    if (pagina() === 'servicios') {
        const repisa = document.querySelector('.chalk-ledge');
        if (repisa && !repisa.querySelector('.nv-vela')) {
            repisa.insertAdjacentHTML('beforeend', vela);
            document.querySelector('.menu-header')?.insertAdjacentHTML('afterbegin', `<span class="nv-tiza-fiestas" aria-hidden="true">${texto('pizarra')}</span>`);
        }
    }
};

document.addEventListener('astro:page-load', () => {
    montarAmbiente();
    montarPortada();
    montarMesas();
});
