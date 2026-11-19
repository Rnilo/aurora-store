/**
 * Genera las portadas SVG del catalogo en frontend/public/img/productos.
 * Uso: node scripts/generar-imagenes.mjs
 * Cada producto produce 3 variantes (-2, -3) para la galeria del detalle.
 * Todo es local: la tienda no depende de imagenes externas.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const destino = resolve(dirname(fileURLToPath(import.meta.url)), '../public/img/productos');
mkdirSync(destino, { recursive: true });

const productos = [
  ['smartphone-nova-x6-5g-128gb', '📱', ['#0f172a', '#1e3a8a']],
  ['smartphone-nova-a3-64gb', '📱', ['#1e293b', '#0f766e']],
  ['smartphone-vertex-go-5g-256gb', '📲', ['#111827', '#4338ca']],
  ['kit-carga-nova', '🔌', ['#1f2937', '#475569']],
  ['notebook-vertex-air-14', '💻', ['#0f172a', '#2563eb']],
  ['notebook-nova-pro-15', '💻', ['#111827', '#0e7490']],
  ['tablet-lumen-pad-11', '📲', ['#1e1b4b', '#7c3aed']],
  ['monitor-solaris-27-qhd', '🖥️', ['#0b1220', '#1d4ed8']],
  ['teclado-mecanico-zenit-k7', '⌨️', ['#18181b', '#52525b']],
  ['audifonos-lumen-air-anc', '🎧', ['#0c0a09', '#7c2d12']],
  ['parlante-pampa-mini', '🔊', ['#052e16', '#16a34a']],
  ['soundbar-solaris-21', '🔉', ['#111827', '#334155']],
  ['smart-tv-solaris-55-4k', '📺', ['#0f172a', '#0369a1']],
  ['smart-tv-nova-65-qled', '📺', ['#111827', '#1e40af']],
  ['refrigerador-andes-320l', '🧊', ['#0c4a6e', '#7dd3fc']],
  ['freezer-andes-200l', '❄️', ['#075985', '#bae6fd']],
  ['horno-electrico-aurora-45l', '🍳', ['#431407', '#c2410c']],
  ['air-fryer-mistral-55l', '🍟', ['#422006', '#ca8a04']],
  ['cafetera-vela-espresso', '☕', ['#292524', '#78350f']],
  ['lavadora-andes-9kg', '🧺', ['#0f172a', '#0891b2']],
  ['secadora-roble-8kg', '👕', ['#1f2937', '#0d9488']],
  ['ventilador-torre-mistral', '🌀', ['#0f172a', '#38bdf8']],
  ['purificador-lumen-air', '🌬️', ['#0c4a6e', '#22d3ee']],
  ['vestido-midi-kaia', '👗', ['#4c0519', '#db2777']],
  ['blazer-roble-oversize', '🧥', ['#1c1917', '#57534e']],
  ['polera-vela-algodon', '👕', ['#1e293b', '#64748b']],
  ['jeans-recto-pampa', '👖', ['#0c2a4d', '#1d4ed8']],
  ['cartera-kaia-city', '👜', ['#3f2d20', '#a16207']],
  ['reloj-zenit-classic', '⌚', ['#1c1917', '#a8a29e']],
  ['zapatillas-vertex-run', '👟', ['#052e16', '#84cc16']],
  ['zapatillas-kaia-urban', '👟', ['#1f2937', '#e2e8f0']],
  ['botas-pampa-trek', '🥾', ['#3f2d20', '#92400e']],
  ['perfume-kaia-bloom', '🌸', ['#4a044e', '#f472b6']],
  ['perfume-roble-noir', '🖤', ['#111827', '#4b5563']],
  ['set-maquillaje-vela-glow', '💄', ['#500724', '#e11d48']],
  ['crema-facial-lumen-hydra', '🧴', ['#083344', '#67e8f9']],
  ['sillon-aurora-oslo', '🛋️', ['#422006', '#d97706']],
  ['lampara-vela-nordica', '🪔', ['#292524', '#facc15']],
  ['copas-solaris-crystal', '🥂', ['#0f172a', '#94a3b8']],
  ['armable-zenit-space', '🧩', ['#1e1b4b', '#6366f1']],
  ['muneca-kaia-aventura', '🪆', ['#4a044e', '#c026d3']],
  ['peluche-pampa-oso', '🧸', ['#422006', '#f59e0b']],
  ['rompecabezas-zenit-1000', '🧩', ['#052e16', '#22c55e']],
  ['mancuernas-zenit-20kg', '🏋️', ['#111827', '#475569']],
  ['bicicleta-pampa-mtb-29', '🚲', ['#0c4a6e', '#0ea5e9']],
  ['carpa-mistral-4p', '⛺', ['#052e16', '#65a30d']],
  ['silla-outdoor-pampa', '🪑', ['#3f2d20', '#b45309']],
  ['set-sabanas-aurora-2p', '🛏️', ['#1e1b4b', '#818cf8']],
];

const variantes = ['', '-2', '-3'];

function svg(emoji, [desde, hasta], indice) {
  const giro = [0, -8, 8][indice];
  const desplazamiento = [0, 120, -140][indice];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${desde}"/>
      <stop offset="100%" stop-color="${hasta}"/>
    </linearGradient>
    <radialGradient id="brillo" cx="30%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#fondo)"/>
  <rect width="800" height="800" fill="url(#brillo)"/>
  <circle cx="${200 + desplazamiento}" cy="620" r="240" fill="#ffffff" opacity="0.07"/>
  <circle cx="${650 + desplazamiento / 2}" cy="170" r="150" fill="#ffffff" opacity="0.10"/>
  <circle cx="400" cy="380" r="250" fill="#ffffff" opacity="0.14"/>
  <text x="400" y="470" font-size="300" text-anchor="middle" transform="rotate(${giro} 400 400)">${emoji}</text>
  <text x="400" y="748" font-size="22" letter-spacing="9" text-anchor="middle" fill="#ffffff" opacity="0.65" font-family="Segoe UI, Arial, sans-serif">AURORA</text>
</svg>`;
}

let total = 0;
for (const [slug, emoji, colores] of productos) {
  variantes.forEach((sufijo, indice) => {
    writeFileSync(resolve(destino, `${slug}${sufijo}.svg`), svg(emoji, colores, indice), 'utf8');
    total += 1;
  });
}

console.log(`Generadas ${total} imagenes para ${productos.length} productos en ${destino}`);
