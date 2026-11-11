// Las sorpresas de Navidad y el atrezo que no cabe en el CSS.
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
   SONIDO
   Todo sintetizado con Web Audio: no hay archivos que cargar y solo suena
   después de que alguien pulse algo (los navegadores no dejan otra cosa).
   ========================================================================== */
const CLAVE_SONIDO = 'casita-navidad-sonido';
const conSonido = () => {
    try { return localStorage.getItem(CLAVE_SONIDO) !== 'no'; } catch { return true; }
};
const guardarSonido = (si: boolean) => {
    try { localStorage.setItem(CLAVE_SONIDO, si ? 'si' : 'no'); } catch { /* sin almacenamiento: da igual */ }
};

let ctx: AudioContext | null = null;
const audio = () => {
    if (!conSonido()) return null;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx ??= new Ctx();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
};
/** Solo si ya hubo un gesto antes: para sonidos que no nacen de un clic */
const audioYaDespierto = () => (ctx && ctx.state === 'running' && conSonido() ? ctx : null);

const ruido = (c: AudioContext, segundos: number) => {
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * segundos), c.sampleRate);
    const datos = buf.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    return src;
};

/** Una campana: varios parciales que se apagan solos */
const campana = (c: AudioContext, frecuencia: number, cuando: number, fuerza = 0.16, larga = 1.1) => {
    const salida = c.createGain();
    salida.connect(c.destination);
    [[1, 1], [2.01, 0.42], [3.02, 0.2], [4.2, 0.12]].forEach(([multiplo, peso]) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = frecuencia * multiplo;
        g.gain.setValueAtTime(0.0001, cuando);
        g.gain.exponentialRampToValueAtTime(fuerza * peso, cuando + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, cuando + larga / multiplo);
        osc.connect(g).connect(salida);
        osc.start(cuando);
        osc.stop(cuando + larga + 0.05);
    });
};

/** Cascabeles de trineo: ruido muy agudo a golpes */
const cascabeles = (c: AudioContext | null, cuando?: number, golpes = 10, paso = 0.085) => {
    if (!c) return;
    const t = cuando ?? c.currentTime;
    const src = ruido(c, golpes * paso + 0.3);
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 7200;
    filtro.Q.value = 1.6;
    const g = c.createGain();
    g.gain.value = 0;
    for (let i = 0; i < golpes; i++) {
        const ti = t + i * paso;
        const fuerza = 0.2 * (i % 2 ? 0.6 : 1);
        g.gain.setValueAtTime(fuerza, ti);
        g.gain.exponentialRampToValueAtTime(0.002, ti + 0.07);
    }
    src.connect(filtro).connect(g).connect(c.destination);
    src.start(t);
};

/** El estribillo de «Jingle Bells» (de 1857, de dominio público) con campanas */
const villancico = () => {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + 0.05;
    const MI = 659.25, SOL = 783.99, DO = 523.25, RE = 587.33;
    const negra = 0.2;
    // nota, duración en negras
    const notas: [number, number][] = [
        [MI, 1], [MI, 1], [MI, 2],
        [MI, 1], [MI, 1], [MI, 2],
        [MI, 1], [SOL, 1], [DO, 1.5], [RE, 0.5], [MI, 3],
    ];
    let ti = t;
    notas.forEach(([f, d]) => {
        campana(c, f, ti, 0.14, Math.min(1.4, 0.5 + d * 0.3));
        ti += d * negra;
    });
    cascabeles(c, t, Math.round((ti - t) / (negra / 2)), negra / 2);
};

/** Arpegio que sube, para la estrella */
const destello = () => {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => campana(c, f, t + i * 0.07, 0.09, 1.3));
};

/** El corcho del cava y la espuma */
const descorche = (c: AudioContext | null) => {
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.07);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g).connect(c.destination);
    osc.start(t); osc.stop(t + 0.1);

    const espuma = ruido(c, 1.2);
    const filtro = c.createBiquadFilter();
    filtro.type = 'highpass';
    filtro.frequency.value = 5000;
    const ge = c.createGain();
    ge.gain.setValueAtTime(0.0001, t + 0.05);
    ge.gain.exponentialRampToValueAtTime(0.07, t + 0.15);
    ge.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    espuma.connect(filtro).connect(ge).connect(c.destination);
    espuma.start(t + 0.05);
};

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

/** Una lluvia de estrellas fugaces desde un punto (la estrella grande) */
const estrellasFugaces = (desde?: DOMRect) => {
    if (sinMovimiento()) return;
    const grupo = document.createElement('div');
    grupo.className = 'nv-fugaces';
    grupo.setAttribute('aria-hidden', 'true');
    const x = desde ? desde.left + desde.width / 2 : window.innerWidth * 0.2;
    const y = desde ? desde.top + desde.height / 2 : window.innerHeight * 0.2;
    const lejos = Math.max(window.innerWidth, window.innerHeight);
    for (let i = 0; i < 7; i++) {
        const f = document.createElement('i');
        f.className = 'nv-fugaz';
        const angulo = azar(0.12, 0.62); // hacia abajo a la derecha
        const largo = lejos * azar(0.45, 0.8);
        f.style.setProperty('--x', `${x + azar(-30, 30)}px`);
        f.style.setProperty('--y', `${y + azar(-20, 20)}px`);
        f.style.setProperty('--giro', `${(angulo * 180) / Math.PI}deg`);
        f.style.setProperty('--largo', `${largo}px`);
        f.style.setProperty('--retraso', `${i * 90}ms`);
        grupo.appendChild(f);
    }
    document.body.appendChild(grupo);
    setTimeout(() => grupo.remove(), 2200);
};

/** Confeti de colores y estrellas que sale de un punto */
const confeti = (x: number, y: number, piezas = 36) => {
    if (sinMovimiento()) return;
    const grupo = document.createElement('div');
    grupo.className = 'nv-confeti';
    grupo.setAttribute('aria-hidden', 'true');
    grupo.style.setProperty('--x', `${x}px`);
    grupo.style.setProperty('--y', `${y}px`);
    const lejos = Math.max(window.innerWidth, window.innerHeight) * 0.55;
    for (let i = 0; i < piezas; i++) {
        const p = document.createElement('i');
        const angulo = azar(0, Math.PI * 2);
        const fuerza = lejos * azar(0.35, 1);
        p.className = i % 4 === 0 ? 'nv-confeti-estrella' : 'nv-confeti-papel';
        p.style.setProperty('--dx', `${Math.cos(angulo) * fuerza}px`);
        p.style.setProperty('--dy', `${Math.sin(angulo) * fuerza * 0.8 + 140}px`);
        p.style.setProperty('--giro', `${azar(-540, 540)}deg`);
        p.style.setProperty('--color', COLORES[i % COLORES.length]);
        p.style.setProperty('--retraso', `${azar(0, 120)}ms`);
        if (i % 4 === 0) p.innerHTML = `<svg viewBox="-11 -11 22 22"><path d="${ESTRELLA5}" /></svg>`;
        grupo.appendChild(p);
    }
    document.body.appendChild(grupo);
    setTimeout(() => grupo.remove(), 2600);
};

/* ==========================================================================
   LA SORPRESA GORDA (la puerta): un regalo que se abre
   ========================================================================== */
const regaloGrande = `<svg viewBox="-110 -130 220 240" aria-hidden="true">
    <g class="nv-sorpresa-caja">
        <rect x="-80" y="-20" width="160" height="120" rx="4" fill="#C8202F" stroke="#F4EBDD" stroke-width="4" />
        <rect x="-14" y="-20" width="28" height="120" fill="#F2C14E" />
        <path d="M -80,-20 L 80,-20" stroke="#8E1526" stroke-width="6" />
    </g>
    <g class="nv-sorpresa-tapa">
        <rect x="-90" y="-50" width="180" height="34" rx="4" fill="#D7263D" stroke="#F4EBDD" stroke-width="4" />
        <rect x="-14" y="-50" width="28" height="34" fill="#F2C14E" />
        <path d="M 0,-50 C -22,-96 -64,-86 -40,-58 C -26,-46 -12,-48 0,-50 C 12,-48 26,-46 40,-58 C 64,-86 22,-96 0,-50 Z" fill="#F2C14E" stroke="#B88A1E" stroke-width="2" />
    </g>
</svg>`;

let sorprendiendo = false;
const sorpresaGorda = (alAcabar: () => void) => {
    sorprendiendo = true;
    const capa = document.createElement('div');
    capa.className = 'nv-sorpresa';
    capa.setAttribute('role', 'presentation');
    capa.innerHTML = `<div class="nv-sorpresa-rayos"></div><div class="nv-sorpresa-regalo">${regaloGrande}</div><p class="nv-sorpresa-texto">${texto('feliz')}</p>`;
    document.body.appendChild(capa);
    villancico();
    setTimeout(() => confeti(window.innerWidth / 2, window.innerHeight * 0.42, 54), 620);
    setTimeout(() => {
        capa.classList.add('nv-sorpresa-sale');
        alAcabar();
        setTimeout(() => { capa.remove(); sorprendiendo = false; }, 420);
    }, 1900);
};

let dejarPasar = false;
const interceptarPuerta = (e: Event) => {
    if (dejarPasar || !enNavidad() || pagina() !== 'inicio') return;
    const puerta = (e.target as Element | null)?.closest?.('#door-group');
    if (!puerta) return;
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (sorprendiendo) return;
    if (sinMovimiento()) return abrir(puerta);
    sorpresaGorda(() => abrir(puerta));
};
const abrir = (puerta: Element) => {
    dejarPasar = true;
    puerta.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    dejarPasar = false;
};
document.addEventListener('click', interceptarPuerta, true);
document.addEventListener('keydown', interceptarPuerta, true);

/* ==========================================================================
   EL TEJADO EN EL MÓVIL
   Sin ratón no hay hover: el toque abre el tejado, salen las estrellas y
   suenan los cascabeles, y después se entra en clientes.
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
    cascabeles(audio());
    const estado = document.getElementById('nav-status');
    if (estado) { estado.textContent = texto('tejadoRegalos'); estado.classList.add('active'); }
    const destino = tejado.getAttribute('href') ?? '/';
    setTimeout(() => { tejadoEnCurso = false; navigate(destino); }, sinMovimiento() ? 250 : 1300);
}, true);

/* ==========================================================================
   LA PORTADA: sello con el sonido, la estrella, el tejado y el cava
   ========================================================================== */
const iconoSonido = (si: boolean) => si
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" class="nv-onda-sonido" /></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" class="nv-onda-sonido" /></svg>';

const montarPortada = () => {
    if (!enNavidad() || pagina() !== 'inicio') return;

    const marca = document.querySelector('.branding');
    if (marca && !marca.querySelector('.nv-sello')) {
        const sello = document.createElement('button');
        sello.type = 'button';
        sello.className = 'nv-sello';
        const pintar = () => {
            const si = conSonido();
            sello.setAttribute('aria-pressed', String(si));
            sello.setAttribute('aria-label', `${texto('edicion')}. ${texto('sonidoAria')}`);
            sello.title = si ? texto('sonidoSi') : texto('sonidoNo');
            sello.innerHTML = `<span class="nv-sello-texto">${texto('edicion')}</span>${iconoSonido(si)}`;
        };
        pintar();
        sello.addEventListener('click', () => {
            guardarSonido(!conSonido());
            pintar();
            if (conSonido()) cascabeles(audio(), undefined, 6);
        });
        marca.querySelector('.tagline')?.after(sello);
    }

    const estrella = document.getElementById('nv-estrella');
    const pedirDeseo = () => {
        destello();
        estrella?.classList.remove('nv-brillando');
        void (estrella as unknown as HTMLElement | null)?.getBoundingClientRect();
        estrella?.classList.add('nv-brillando');
        estrellasFugaces(estrella?.getBoundingClientRect());
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

    // Con ratón: cascabeles al levantar el tejado y corcho al acercarse al
    // cava, si el sonido ya está despierto (alguien pulsó algo antes) y sin
    // repetirlo a cada roce
    const unaVezCada = (ms: number, fn: () => void) => {
        let ultimo = 0;
        return () => {
            const ahora = Date.now();
            if (ahora - ultimo < ms) return;
            ultimo = ahora;
            fn();
        };
    };
    document.getElementById('roof-clients-link')?.addEventListener('mouseenter', unaVezCada(2500, () => cascabeles(audioYaDespierto())));
    document.getElementById('wine-group')?.addEventListener('mouseenter', unaVezCada(4000, () => descorche(audioYaDespierto())));
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
