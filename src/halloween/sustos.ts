// Los sustos de la casa encantada y el atrezo que no cabe en el CSS.
//
// Solo hace algo cuando <html data-tema="halloween">. Los escuchadores de
// documento se ponen una vez (este módulo se carga una sola vez aunque el
// Client Router cambie de página); el atrezo se monta en cada astro:page-load
// porque el <body> es nuevo en cada página.
import { navigate } from 'astro:transitions/client';
import { idiomas, idiomaPorDefecto, type Idioma } from '../i18n/config';
import { textosHalloween as H } from './textos';

const raiz = document.documentElement;
const disfrazada = () => raiz.dataset.tema === 'halloween';
const pagina = () => raiz.dataset.pagina ?? '';
const idioma = (): Idioma => {
    const lang = raiz.lang as Idioma;
    return idiomas.includes(lang) ? lang : idiomaPorDefecto;
};
const texto = (clave: keyof typeof H) => H[clave][idioma()];
const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tactil = () => window.matchMedia('(hover: none)').matches;

/* ==========================================================================
   SONIDO
   Todo sintetizado con Web Audio: no hay archivos que cargar y solo suena
   después de que alguien pulse algo (los navegadores no dejan otra cosa).
   ========================================================================== */
const CLAVE_SONIDO = 'casita-sustos-sonido';
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

/** El grito del fantasma de la puerta: un lamento que sube y un soplido */
const grito = () => {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    const salida = c.createGain();
    salida.gain.setValueAtTime(0.0001, t);
    salida.gain.exponentialRampToValueAtTime(0.28, t + 0.06);
    salida.gain.setValueAtTime(0.28, t + 0.55);
    salida.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
    salida.connect(c.destination);

    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 1100;
    filtro.Q.value = 0.9;
    filtro.connect(salida);

    // Dos voces desafinadas con vibrato: suena a garganta, no a pitido
    [0, 7].forEach((desafine) => {
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 + desafine, t);
        osc.frequency.exponentialRampToValueAtTime(980 + desafine * 3, t + 0.35);
        osc.frequency.exponentialRampToValueAtTime(620, t + 1.1);
        const vibrato = c.createOscillator();
        const hondura = c.createGain();
        vibrato.frequency.value = 9;
        hondura.gain.value = 38;
        vibrato.connect(hondura).connect(osc.frequency);
        osc.connect(filtro);
        osc.start(t); vibrato.start(t);
        osc.stop(t + 1.2); vibrato.stop(t + 1.2);
    });

    const soplo = ruido(c, 0.6);
    const paso = c.createBiquadFilter();
    paso.type = 'highpass';
    paso.frequency.value = 1800;
    const g = c.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    soplo.connect(paso).connect(g).connect(c.destination);
    soplo.start(t);
};

/** El aullido de la luna */
const aullido = () => {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.35);
    g.gain.setValueAtTime(0.18, t + 1.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    const filtro = c.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 1400;
    g.connect(filtro).connect(c.destination);

    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(690, t + 0.6);
    osc.frequency.setValueAtTime(690, t + 1.3);
    osc.frequency.exponentialRampToValueAtTime(470, t + 2.4);
    const vibrato = c.createOscillator();
    const hondura = c.createGain();
    vibrato.frequency.value = 5.5;
    hondura.gain.value = 9;
    vibrato.connect(hondura).connect(osc.frequency);
    osc.connect(g);
    osc.start(t); vibrato.start(t);
    osc.stop(t + 2.5); vibrato.stop(t + 2.5);
};

/** Aleteo de murciélagos: ruido troceado muy deprisa */
const aleteo = (c: AudioContext | null = audio()) => {
    if (!c) return;
    const t = c.currentTime;
    const src = ruido(c, 0.7);
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 2400;
    filtro.Q.value = 0.7;
    const g = c.createGain();
    g.gain.value = 0;
    // Treinta golpes de ala en 0,7 s, cada vez más lejos
    for (let i = 0; i < 30; i++) {
        const ti = t + i * 0.023;
        const fuerza = 0.16 * (1 - i / 30);
        g.gain.setValueAtTime(fuerza, ti);
        g.gain.linearRampToValueAtTime(0, ti + 0.016);
    }
    src.connect(filtro).connect(g).connect(c.destination);
    src.start(t);
};

/* ==========================================================================
   DIBUJOS QUE SE MONTAN DESDE AQUÍ
   ========================================================================== */
const MURCIELAGO = 'M0,-3 C2,-8 4,-8 5,-5 C9,-10 15,-10 20,-6 C17,-5 16,-2 17,1 C14,-1 11,0 10,3 C8,1 6,1 4,3 C3,2 1,2 0,4 C-1,2 -3,2 -4,3 C-6,1 -8,1 -10,3 C-11,0 -14,-1 -17,1 C-16,-2 -17,-5 -20,-6 C-15,-10 -9,-10 -5,-5 C-4,-8 -2,-8 0,-3 Z';
const svgMurcielago = `<svg viewBox="-21 -11 42 16" aria-hidden="true"><path d="${MURCIELAGO}" /></svg>`;

/** Telaraña de esquina: radios desde la esquina y vueltas que se combarán */
const telarana = (() => {
    const radios = 7;
    const vueltas = [26, 50, 76, 102, 128];
    const ang = (i: number) => (i / (radios - 1)) * (Math.PI / 2);
    const pt = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
    let d = '';
    for (let i = 0; i < radios; i++) d += `M0,0 L${pt(140, ang(i))} `;
    vueltas.forEach((r) => {
        for (let i = 0; i < radios - 1; i++) {
            const a1 = ang(i), a2 = ang(i + 1), am = (a1 + a2) / 2;
            d += `M${pt(r, a1)} Q${pt(r * 0.86, am)} ${pt(r, a2)} `;
        }
    });
    return `<svg viewBox="0 0 140 140" aria-hidden="true"><path d="${d}" /></svg>`;
})();

const vela = `<svg class="hw-vela" viewBox="0 0 40 92" aria-hidden="true">
    <circle cx="20" cy="22" r="20" class="hw-vela-halo" />
    <ellipse cx="20" cy="88" rx="15" ry="3.5" fill="rgba(0,0,0,0.35)" />
    <path d="M10 42 h20 v44 a10 3 0 0 1 -20 0 Z" fill="#EFE6D2" />
    <path d="M10 42 q2 12 4 2 q3 16 6 3 q2 9 5 0 q2 7 5 -5 Z" fill="#E3D6BC" />
    <ellipse cx="20" cy="42" rx="10" ry="2.6" fill="#F7F0E2" />
    <line x1="20" y1="42" x2="20" y2="35" stroke="#2a2018" stroke-width="1.6" />
    <g class="hw-llama">
        <path d="M20 12 C 28 23 27 33 20 36 C 13 33 12 23 20 12 Z" fill="#FFC857" />
        <path d="M20 22 C 23.5 27 23.5 31.5 20 33.5 C 16.5 31.5 16.5 27 20 22 Z" fill="#FF7A1A" />
    </g>
</svg>`;

const calabaza = `<svg class="hw-calabaza-suelta" viewBox="-26 -26 52 50" aria-hidden="true">
    <circle r="26" class="hw-calabaza-luz" />
    <path d="M -1,-14 Q 0,-21 5,-22" class="hw-tallo" />
    <ellipse cx="-8" cy="0" rx="9.5" ry="13.5" class="hw-gajo" />
    <ellipse cx="8" cy="0" rx="9.5" ry="13.5" class="hw-gajo" />
    <ellipse cx="0" cy="0" rx="9" ry="14.5" class="hw-gajo" />
    <g class="hw-cara">
        <path d="M -9,-4 L -4,-4 L -6.5,-9 Z M 4,-4 L 9,-4 L 6.5,-9 Z" />
        <path d="M -10,3 L -6,7 L -3,4 L 0,8 L 3,4 L 6,7 L 10,3 L 7,10 L -7,10 Z" />
    </g>
</svg>`;

const hoja = (color: string, giro: number) =>
    `<svg class="hw-hoja" style="--giro:${giro}deg" viewBox="-12 -12 24 24" aria-hidden="true"><path d="M0,-11 C6,-6 9,0 0,11 C-9,0 -6,-6 0,-11 Z M0,-9 L0,11" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="0.8" /></svg>`;

const fantasmaGrande = `<svg viewBox="0 0 200 240" aria-hidden="true">
    <path d="M100 8 C 44 8 20 54 20 106 L 20 208 Q 36 190 50 210 Q 65 230 79 208 Q 91 191 100 212 Q 110 231 122 208 Q 136 190 150 210 Q 164 230 180 206 L 180 106 C 180 54 156 8 100 8 Z" class="hw-susto-cuerpo" />
    <ellipse cx="72" cy="92" rx="15" ry="23" class="hw-susto-hueco" />
    <ellipse cx="128" cy="92" rx="15" ry="23" class="hw-susto-hueco" />
    <ellipse cx="100" cy="152" rx="21" ry="31" class="hw-susto-hueco" />
</svg>`;

/* ==========================================================================
   EL AMBIENTE: telarañas, murciélagos y relámpagos, en todas las páginas
   ========================================================================== */
const montarAmbiente = () => {
    document.querySelector('.hw-ambiente')?.remove();
    if (!disfrazada()) return;

    const capa = document.createElement('div');
    capa.className = 'hw-ambiente';
    capa.setAttribute('aria-hidden', 'true');
    capa.innerHTML = `
        <div class="hw-relampago"></div>
        <div class="hw-telarana hw-telarana-izq">${telarana}</div>
        <div class="hw-telarana hw-telarana-der">${telarana}</div>
        <div class="hw-colgada"><span class="hw-colgada-hilo"></span><svg viewBox="-16 -16 32 32"><path d="M -4,-2 L -11,-7 L -13,-12 M -4,0 L -12,-1 L -15,-5 M -4,2 L -11,5 L -13,10 M -3,4 L -8,9 L -9,14 M 4,-2 L 11,-7 L 13,-12 M 4,0 L 12,-1 L 15,-5 M 4,2 L 11,5 L 13,10 M 3,4 L 8,9 L 9,14" class="hw-patas" /><ellipse cx="0" cy="2" rx="5.5" ry="6.5" class="hw-arana-cuerpo" /><circle cx="0" cy="-5" r="3.5" class="hw-arana-cuerpo" /><circle cx="-1.3" cy="-5.5" r="0.9" class="hw-ojillo" /><circle cx="1.3" cy="-5.5" r="0.9" class="hw-ojillo" /></svg></div>
        ${[1, 2, 3].map((n) => `<div class="hw-vuelo hw-vuelo-${n}"><div class="hw-aleta">${svgMurcielago}</div></div>`).join('')}
    `;
    document.body.appendChild(capa);
};

/** Una bandada que cruza la pantalla de golpe (la luna, el tejado en móvil) */
const bandada = (desde?: DOMRect, rumbo = -Math.PI / 2, abanico = 0.32) => {
    if (sinMovimiento()) return;
    const grupo = document.createElement('div');
    grupo.className = 'hw-bandada-grande';
    grupo.setAttribute('aria-hidden', 'true');
    const x = desde ? desde.left + desde.width / 2 : window.innerWidth / 2;
    const y = desde ? desde.top + desde.height / 2 : window.innerHeight / 2;
    grupo.style.setProperty('--x', `${x}px`);
    grupo.style.setProperty('--y', `${y}px`);
    for (let i = 0; i < 9; i++) {
        const b = document.createElement('div');
        b.className = 'hw-bandada-uno';
        const angulo = rumbo + (i - 4) * abanico + (Math.random() - 0.5) * 0.25;
        const lejos = Math.max(window.innerWidth, window.innerHeight) * (0.7 + Math.random() * 0.4);
        b.style.setProperty('--dx', `${Math.cos(angulo) * lejos}px`);
        b.style.setProperty('--dy', `${Math.sin(angulo) * lejos}px`);
        b.style.setProperty('--retraso', `${i * 45}ms`);
        b.style.setProperty('--tam', `${26 + Math.random() * 26}px`);
        b.innerHTML = `<div class="hw-aleta">${svgMurcielago}</div>`;
        grupo.appendChild(b);
    }
    document.body.appendChild(grupo);
    setTimeout(() => grupo.remove(), 2800);
};

/* ==========================================================================
   EL SUSTO GORDO (la puerta)
   ========================================================================== */
let asustando = false;
const sustoGordo = (alAcabar: () => void) => {
    asustando = true;
    const capa = document.createElement('div');
    capa.className = 'hw-susto';
    capa.setAttribute('role', 'presentation');
    capa.innerHTML = `<div class="hw-susto-fantasma">${fantasmaGrande}</div><p class="hw-susto-texto">${texto('bu')}</p>`;
    document.body.appendChild(capa);
    grito();
    setTimeout(() => {
        capa.classList.add('hw-susto-sale');
        alAcabar();
        setTimeout(() => { capa.remove(); asustando = false; }, 380);
    }, 1050);
};

let dejarPasar = false;
const interceptarPuerta = (e: Event) => {
    if (dejarPasar || !disfrazada() || pagina() !== 'inicio') return;
    const puerta = (e.target as Element | null)?.closest?.('#door-group');
    if (!puerta) return;
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (asustando) return;
    if (sinMovimiento()) return abrir(puerta);
    sustoGordo(() => abrir(puerta));
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
   Sin ratón no hay hover, así que el tejado nunca se levantaba: el toque lo
   abre, salen los murciélagos y después se entra en clientes.
   ========================================================================== */
let tejadoEnCurso = false;
document.addEventListener('click', (e) => {
    if (!disfrazada() || pagina() !== 'inicio' || !tactil()) return;
    const tejado = (e.target as Element | null)?.closest?.('#roof-clients-link') as HTMLAnchorElement | SVGAElement | null;
    if (!tejado) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (tejadoEnCurso) return;
    tejadoEnCurso = true;
    tejado.classList.add('hw-abierto');
    aleteo();
    const estado = document.getElementById('nav-status');
    if (estado) { estado.textContent = texto('tejadoOtraVez'); estado.classList.add('active'); }
    const destino = tejado.getAttribute('href') ?? '/';
    setTimeout(() => { tejadoEnCurso = false; navigate(destino); }, sinMovimiento() ? 250 : 1300);
}, true);

/* ==========================================================================
   LA PORTADA: sello de Halloween con el sonido, la luna y el ático
   ========================================================================== */
const iconoSonido = (si: boolean) => si
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" class="hw-onda-sonido" /></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" class="hw-onda-sonido" /></svg>';

const montarPortada = () => {
    if (!disfrazada() || pagina() !== 'inicio') return;

    const marca = document.querySelector('.branding');
    if (marca && !marca.querySelector('.hw-sello')) {
        const sello = document.createElement('button');
        sello.type = 'button';
        sello.className = 'hw-sello';
        const pintar = () => {
            const si = conSonido();
            sello.setAttribute('aria-pressed', String(si));
            sello.setAttribute('aria-label', `${texto('edicion')}. ${texto('sonidoAria')}`);
            sello.title = si ? texto('sonidoSi') : texto('sonidoNo');
            sello.innerHTML = `<span class="hw-sello-texto">${texto('edicion')}</span>${iconoSonido(si)}`;
        };
        pintar();
        sello.addEventListener('click', () => {
            guardarSonido(!conSonido());
            pintar();
            if (conSonido()) aleteo();
        });
        marca.querySelector('.tagline')?.after(sello);
    }

    const luna = document.getElementById('hw-luna');
    const aullar = () => {
        aullido();
        luna?.classList.remove('hw-aullando');
        void (luna as unknown as HTMLElement | null)?.getBoundingClientRect();
        luna?.classList.add('hw-aullando');
        // Desde la luna, hacia el otro lado del cielo
        bandada(luna?.getBoundingClientRect(), -0.12, 0.1);
    };
    luna?.addEventListener('click', aullar);
    luna?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aullar(); }
    });

    // Con ratón: al levantar el tejado se oye el aleteo, si el sonido ya
    // está despierto (alguien pulsó algo antes) y sin repetirlo a cada roce
    const tejado = document.getElementById('roof-clients-link');
    let ultimo = 0;
    tejado?.addEventListener('mouseenter', () => {
        const ahora = Date.now();
        if (ahora - ultimo < 2500) return;
        ultimo = ahora;
        aleteo(audioYaDespierto());
    });
};

/* ==========================================================================
   OTRAS PÁGINAS: velas, calabazas y hojas sobre las mesas
   ========================================================================== */
const montarMesas = () => {
    if (!disfrazada()) return;

    if (pagina() === 'clientes') {
        const barra = document.querySelector('.bar-counter');
        if (barra && !barra.querySelector('.hw-mesa')) {
            const deco = document.createElement('div');
            deco.className = 'hw-mesa hw-mesa-barra';
            deco.setAttribute('aria-hidden', 'true');
            deco.innerHTML = `<div class="hw-sitio hw-sitio-velas">${vela}${vela}</div><div class="hw-sitio hw-sitio-calabaza">${calabaza}</div>`;
            barra.prepend(deco);
        }
    }

    if (pagina() === 'galeria') {
        document.querySelectorAll('.bar-table').forEach((mesa, i) => {
            if (mesa.querySelector('.hw-mesa')) return;
            const deco = document.createElement('div');
            deco.className = 'hw-mesa';
            deco.setAttribute('aria-hidden', 'true');
            deco.innerHTML = `
                <div class="hw-sitio hw-sitio-vela">${vela}</div>
                <div class="hw-sitio hw-sitio-calabaza">${calabaza}</div>
                <div class="hw-sitio hw-sitio-hojas">${hoja('#C2561A', -20 + i * 15)}${hoja('#8A3A12', 35)}${hoja('#D9822B', 110 - i * 20)}</div>`;
            mesa.prepend(deco);
        });
    }

    if (pagina() === 'portfolio') {
        const mueble = document.querySelector('.mueble');
        if (mueble && !mueble.querySelector('.hw-mesa')) {
            const deco = document.createElement('div');
            deco.className = 'hw-mesa hw-mesa-mueble';
            deco.setAttribute('aria-hidden', 'true');
            deco.innerHTML = `<div class="hw-sitio hw-sitio-velas">${vela}${vela}</div><div class="hw-sitio hw-sitio-calabaza">${calabaza}</div>`;
            mueble.append(deco);
        }
    }

    if (pagina() === 'servicios') {
        const repisa = document.querySelector('.chalk-ledge');
        if (repisa && !repisa.querySelector('.hw-vela')) {
            repisa.insertAdjacentHTML('beforeend', vela);
            const cabecera = document.querySelector('.menu-header');
            cabecera?.insertAdjacentHTML('afterbegin', `<span class="hw-tiza-bu" aria-hidden="true">${texto('pizarraBu')}</span>`);
        }
    }
};

document.addEventListener('astro:page-load', () => {
    montarAmbiente();
    montarPortada();
    montarMesas();
});
