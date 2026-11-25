// The throne room: crimson walls sown with golden bees, a gilded throne
// under velvet drapes, ermine spilling down the dais, candelabra, light
// falling through a high window, and a war banner that carries the
// context window: its laurel wreath fills in as the context fills.

const W = 1600
const H = 1000

const r1 = (n: number): string => n.toFixed(1)

function rng(start: number): () => number {
  let seed = start
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function clean(s: string): string {
  return s.replace(/[^A-Za-z0-9%. -]/g, '')
}

// Gold dust drifting up through the window light. Each mote is drawn twice,
// a screen height apart, in a group that rises one screen height and repeats.
function dust(): string {
  const rand = rng(1804)
  let out = ''
  for (let i = 0; i < 55; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 0.8 + rand() * 1.8
    const dur = 45 + rand() * 40
    const sway = 5 + rand() * 6
    out +=
      `<g class="rise" style="animation-duration:${r1(dur)}s;animation-delay:-${r1(rand() * dur)}s">` +
      `<g class="sway" style="animation-duration:${r1(sway)}s;animation-delay:-${r1(rand() * sway)}s">` +
      `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/><circle cx="${r1(x)}" cy="${r1(y + H)}" r="${r1(r)}"/>` +
      `</g></g>`
  }
  return `<g fill="#f3d27a" opacity="0.55">${out}</g>`
}

// A stylised imperial eagle, wings spread, centred on (x, y), scaled by s.
function eagle(x: number, y: number, s: number, fill: string): string {
  let wings = ''
  for (let k = 0; k < 6; k++) {
    const a = 4 - k * 15
    const len = 74 - k * 5
    const rad = (a * Math.PI) / 180
    const ex = Math.cos(rad) * len
    const ey = Math.sin(rad) * len
    wings += `<path d="M0 -4 Q${r1(ex * 0.5)} ${r1(ey * 0.5 - 8)} ${r1(ex)} ${r1(ey)} Q${r1(ex * 0.6 + 4)} ${r1(ey * 0.6 + 6)} 0 6 Z"/>`
    wings += `<path d="M0 -4 Q${r1(-ex * 0.5)} ${r1(ey * 0.5 - 8)} ${r1(-ex)} ${r1(ey)} Q${r1(-ex * 0.6 - 4)} ${r1(ey * 0.6 + 6)} 0 6 Z"/>`
  }
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">` +
    wings +
    `<ellipse cx="0" cy="12" rx="13" ry="26"/>` +
    `<circle cx="-4" cy="-22" r="10"/>` +
    `<path d="M-12 -24 l-10 4 l9 3 Z"/>` +
    `<path d="M-10 36 L0 62 L10 36 L18 54 L6 30 Z M-10 36 L-18 54 L-6 30 Z"/>` +
    `<path d="M-14 30 q -10 6 -16 2 M14 30 q 10 6 16 2" stroke="${fill}" stroke-width="3" fill="none"/>` +
    `</g>`
  )
}

// A laurel wreath around (cx, cy): leaves up both sides, the first `lit` gold.
function laurel(cx: number, cy: number, rx: number, ry: number, total: number, lit: number): string {
  let out = ''
  const perSide = total / 2
  for (let i = 0; i < total; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const step = Math.floor(i / 2)
    const t = (step + 0.5) / perSide
    const ang = Math.PI / 2 + side * (t * Math.PI * 0.82)
    const x = cx + Math.cos(ang) * rx
    const y = cy + Math.sin(ang) * ry
    const rot = (ang * 180) / Math.PI + (side < 0 ? -60 : 60)
    const on = i < lit
    out +=
      `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="12" ry="5" transform="rotate(${r1(rot)} ${r1(x)} ${r1(y)})" ` +
      `fill="${on ? '#e8c25a' : '#6b5a36'}" opacity="${on ? 1 : 0.45}"/>`
  }
  return out
}

function candelabrum(x: number, foot: number): string {
  const flame = (fx: number, fy: number, d: number): string =>
    `<circle cx="${fx}" cy="${fy - 6}" r="22" fill="url(#candleGlow)"/>` +
    `<rect x="${fx - 4}" y="${fy}" width="8" height="34" fill="#f3ead4"/>` +
    `<path class="flame" style="animation-delay:-${d}s;transform-origin:${fx}px ${fy}px" d="M${fx} ${fy - 18} q 7 10 0 18 q -7 -8 0 -18 Z" fill="#ffd27a"/>`
  const top = foot - 170
  return (
    `<path d="M${x - 28} ${foot} h56 l-12 -16 h-32 Z" fill="url(#gold)"/>` +
    `<rect x="${x - 4}" y="${top + 30}" width="8" height="${foot - top - 46}" fill="url(#gold)"/>` +
    `<circle cx="${x}" cy="${top + 80}" r="9" fill="url(#gold)"/>` +
    `<path d="M${x - 46} ${top + 30} q 0 30 46 30 q 46 0 46 -30" stroke="url(#gold)" stroke-width="7" fill="none"/>` +
    `<rect x="${x - 54}" y="${top + 26}" width="16" height="6" fill="url(#gold)"/><rect x="${x + 38}" y="${top + 26}" width="16" height="6" fill="url(#gold)"/>` +
    `<rect x="${x - 8}" y="${top + 6}" width="16" height="6" fill="url(#gold)"/>` +
    flame(x - 46, top - 8, 0.4) + flame(x, top - 28, 1.1) + flame(x + 46, top - 8, 0.7)
  )
}

// The banner on the left wall, carrying the context window.
function banner(percent: number | undefined, tokens: number | undefined, fill: number): string {
  const x0 = 55
  const x1 = 265
  const cx = (x0 + x1) / 2
  const top = 130
  const bot = 650
  const big = percent === undefined ? '-' : `${percent}%`
  const small = tokens === undefined ? '-' : tokens >= 1000 ? `${Math.round(tokens / 1000)}k` : `${tokens}`
  const third = (x1 - x0) / 3
  const leaves = 22
  const lit = Math.round(fill * leaves)
  const shape = `M${x0} ${top} H${x1} V${bot} L${cx + 30} ${bot + 44} L${cx} ${bot + 14} L${cx - 30} ${bot + 44} L${x0} ${bot} Z`
  return (
    // crossbar, finials and cords
    `<rect x="${x0 - 22}" y="${top - 10}" width="${x1 - x0 + 44}" height="10" rx="4" fill="url(#gold)"/>` +
    `<path d="M${x0 - 22} ${top - 5} l-16 -8 l4 8 l-4 8 Z M${x1 + 22} ${top - 5} l16 -8 l-4 8 l4 8 Z" fill="url(#gold)"/>` +
    `<path d="M${cx} ${top - 10} V60" stroke="#c9a24a" stroke-width="3"/>` +
    `<g class="banner" style="transform-origin:${cx}px ${top}px">` +
    `<clipPath id="bannerClip"><path d="${shape}"/></clipPath>` +
    `<g clip-path="url(#bannerClip)">` +
    `<rect x="${x0}" y="${top}" width="${third}" height="${bot - top + 50}" fill="#1f3b8f"/>` +
    `<rect x="${x0 + third}" y="${top}" width="${third}" height="${bot - top + 50}" fill="#f2ecdf"/>` +
    `<rect x="${x0 + 2 * third}" y="${top}" width="${third}" height="${bot - top + 50}" fill="#b3202e"/>` +
    `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top + 50}" fill="url(#cloth)"/>` +
    `</g>` +
    `<path d="${shape}" fill="none" stroke="url(#gold)" stroke-width="5"/>` +
    // eagle atop the cartouche
    eagle(cx, 205, 0.85, '#e8c25a') +
    // cartouche with the context
    `<ellipse cx="${cx}" cy="370" rx="80" ry="92" fill="#f6efdf" stroke="url(#gold)" stroke-width="5"/>` +
    laurel(cx, 370, 96, 110, leaves, lit) +
    `<text x="${cx}" y="378" text-anchor="middle" font-family="serif" font-weight="700" font-size="48" fill="#3a0c12">${clean(big)}</text>` +
    `<text x="${cx}" y="405" text-anchor="middle" font-family="serif" font-size="14" letter-spacing="3" fill="#7a5a28">CONTEXT</text>` +
    // plaque with the tokens
    `<rect x="${cx - 70}" y="500" width="140" height="58" rx="4" fill="url(#gold)" stroke="#7a5a28" stroke-width="2"/>` +
    `<text x="${cx}" y="531" text-anchor="middle" font-family="serif" font-weight="700" font-size="26" fill="#3a0c12">${clean(small)}</text>` +
    `<text x="${cx}" y="550" text-anchor="middle" font-family="serif" font-size="11" letter-spacing="3" fill="#3a0c12">TOKENS</text>` +
    // fringe
    fringe(x0, bot, cx - 30, bot + 44) + fringe(cx + 30, bot + 44, x1, bot) +
    `</g>`
  )
}

function fringe(xa: number, ya: number, xb: number, yb: number): string {
  let d = ''
  const n = 12
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = xa + (xb - xa) * t
    const y = ya + (yb - ya) * t
    d += `M${r1(x)} ${r1(y)} v14 `
  }
  return `<path d="${d}" stroke="#d9b04a" stroke-width="3"/>`
}

// The throne on the dais, framed by velvet drapes.
function throne(): string {
  const cx = 1455
  return (
    `<circle cx="${cx}" cy="470" r="260" fill="url(#throneGlow)"/>` +
    // drapes
    `<path d="M1290 70 H1600 V880 Q1580 640 1600 420 Q1520 300 1430 160 Q1370 110 1290 120 Z" fill="url(#velvet)"/>` +
    `<path d="M1290 70 H1600 V120 Q1520 160 1445 120 Q1370 160 1290 120 Z" fill="#7d1420"/>` +
    `<path d="M1290 120 Q1370 160 1445 120 Q1520 160 1600 120" stroke="url(#gold)" stroke-width="6" fill="none"/>` +
    `<path d="M1600 420 q -18 8 -30 -4" stroke="url(#gold)" stroke-width="8" fill="none"/>` +
    `<circle cx="1566" cy="426" r="9" fill="url(#gold)"/><path d="M1566 434 l-8 34 h16 Z" fill="url(#gold)"/>` +
    // dais
    `<rect x="1270" y="930" width="330" height="70" fill="#2a1013"/><rect x="1270" y="926" width="330" height="6" fill="url(#gold)"/>` +
    `<rect x="1305" y="892" width="295" height="40" fill="#34151a"/><rect x="1305" y="888" width="295" height="6" fill="url(#gold)"/>` +
    `<rect x="1335" y="856" width="265" height="36" fill="#3c181e"/><rect x="1335" y="852" width="265" height="6" fill="url(#gold)"/>` +
    // round back, like a sunburst rose window
    `<circle cx="${cx}" cy="440" r="150" fill="#2a1a0e"/>` +
    sunburst(cx, 440, 132) +
    `<circle cx="${cx}" cy="440" r="150" fill="none" stroke="url(#gold)" stroke-width="28"/>` +
    `<circle cx="${cx}" cy="440" r="150" fill="none" stroke="#7a5a28" stroke-width="2" stroke-dasharray="3 9"/>` +
    `<circle cx="${cx}" cy="440" r="164" fill="none" stroke="#f3d27a" stroke-width="2" opacity="0.6"/>` +
    `<path d="M${cx - 12} 282 l12 -22 l12 22 Z" fill="url(#gold)"/>` +
    // posts, armrests and orbs
    `<rect x="1318" y="560" width="28" height="300" fill="url(#gold)"/><rect x="1564" y="560" width="28" height="300" fill="url(#gold)"/>` +
    `<path d="M1318 560 h28 v10 h-28 Z M1564 560 h28 v10 h-28 Z" fill="#7a5a28"/>` +
    `<circle cx="1332" cy="536" r="24" fill="url(#ivory)"/><circle cx="1578" cy="536" r="24" fill="url(#ivory)"/>` +
    `<rect x="1312" y="602" width="40" height="10" fill="url(#gold)"/><rect x="1558" y="602" width="40" height="10" fill="url(#gold)"/>` +
    // seat and cushion
    `<rect x="1346" y="640" width="218" height="40" rx="10" fill="url(#velvet)"/>` +
    `<rect x="1340" y="676" width="230" height="20" fill="url(#gold)"/>` +
    // front panel with the N in laurels
    `<rect x="1346" y="696" width="218" height="160" fill="#8e1b2a"/>` +
    `<rect x="1356" y="706" width="198" height="140" fill="none" stroke="url(#gold)" stroke-width="4"/>` +
    laurel(cx, 776, 44, 46, 18, 18) +
    `<text x="${cx}" y="796" text-anchor="middle" font-family="serif" font-weight="700" font-size="54" fill="#e8c25a">N</text>` +
    // laurel crown resting on the cushion
    `<g transform="translate(${cx} 628)">` +
    `<ellipse cx="0" cy="6" rx="34" ry="9" fill="none" stroke="#b8902e" stroke-width="5"/>` +
    leafRing() +
    `</g>` +
    // ermine robe draped over the seat and down the dais
    `<path d="M1346 650 Q1318 690 1330 760 Q1326 830 1296 900 Q1330 920 1372 912 Q1388 860 1384 800 Q1380 720 1400 668 Q1380 648 1346 650 Z" fill="url(#ermine)"/>` +
    `<path d="M1384 800 Q1388 860 1372 912" stroke="#8e1b2a" stroke-width="8" fill="none"/>` +
    // sceptre leaning on the throne
    `<path d="M1600 260 L1530 900" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>` +
    `<circle cx="1595" cy="300" r="7" fill="url(#gold)"/><circle cx="1570" cy="530" r="6" fill="url(#gold)"/>` +
    eagle(1602, 238, 0.32, '#e8c25a')
  )
}

function sunburst(cx: number, cy: number, r: number): string {
  let out = ''
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    out += `<path d="M${cx} ${cy} L${r1(x)} ${r1(y)}" stroke="#7a5a28" stroke-width="2" opacity="0.8"/>`
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const x = cx + Math.cos(a) * r * 0.72
    const y = cy + Math.sin(a) * r * 0.72
    out += star(x, y, 9)
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="34" fill="url(#gold)"/>` + star(cx, cy, 20, '#7a3a14')
}

function star(x: number, y: number, r: number, fill = '#c9a24a'): string {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 === 0 ? r : r * 0.42
    d += `${i === 0 ? 'M' : 'L'}${r1(x + Math.cos(a) * rr)} ${r1(y + Math.sin(a) * rr)} `
  }
  return `<path d="${d}Z" fill="${fill}"/>`
}

function leafRing(): string {
  let out = ''
  for (let i = 0; i < 14; i++) {
    const a = Math.PI + (i / 13) * Math.PI
    const x = Math.cos(a) * 34
    const y = 6 + Math.sin(a) * 9 - 6
    const rot = (a * 180) / Math.PI + 90 + (i < 7 ? -35 : 35)
    out += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="9" ry="3.6" transform="rotate(${r1(rot)} ${r1(x)} ${r1(y)})" fill="#e8c25a"/>`
  }
  return out
}

export function buildScene(percent: number | undefined, tokens: number | undefined): string {
  const fill = Math.min(1, Math.max(0, (percent ?? 0) / 100))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a070c"/><stop offset="0.5" stop-color="#4a0d15"/><stop offset="1" stop-color="#2a070c"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset="0.45" stop-color="#c9952f"/><stop offset="0.7" stop-color="#f0cf72"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
<linearGradient id="velvet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e0c16"/><stop offset="0.35" stop-color="#a3192a"/><stop offset="0.6" stop-color="#6e0f1a"/><stop offset="1" stop-color="#b52234"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1416"/><stop offset="1" stop-color="#140809"/></linearGradient>
<linearGradient id="shaft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c8" stop-opacity="0.16"/><stop offset="1" stop-color="#fff1c8" stop-opacity="0"/></linearGradient>
<linearGradient id="cloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.18"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.06"/><stop offset="0.55" stop-color="#000" stop-opacity="0.14"/><stop offset="0.8" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.2"/></linearGradient>
<radialGradient id="ivory" cx="0.35" cy="0.35"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#cbbf9e"/></radialGradient>
<radialGradient id="throneGlow"><stop offset="0" stop-color="#ffcf6a" stop-opacity="0.35"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient>
<radialGradient id="candleGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<pattern id="bees" width="90" height="90" patternUnits="userSpaceOnUse">
<g fill="#d9a83e" opacity="0.16"><ellipse cx="45" cy="47" rx="5" ry="9"/><circle cx="45" cy="35" r="4"/><ellipse cx="38" cy="40" rx="7" ry="4" transform="rotate(-30 38 40)"/><ellipse cx="52" cy="40" rx="7" ry="4" transform="rotate(30 52 40)"/></g>
<path d="M0 0 h4 M86 0 h4 M0 90 h4 M86 90 h4" stroke="#d9a83e" stroke-width="1" opacity="0.15"/>
</pattern>
<pattern id="ermine" width="64" height="64" patternUnits="userSpaceOnUse">
<rect width="64" height="64" fill="#f6f1e6"/>
<path d="M18 14 l2 8 l2 -8 Z M50 46 l2 8 l2 -8 Z" fill="#1a1414"/>
</pattern>
</defs>
<style>
.rise { animation-name: rise; animation-timing-function: linear; animation-iteration-count: infinite; }
.sway { animation-name: sway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
.flame { animation: flicker 2.6s ease-in-out infinite alternate; }
.banner { animation: wave 9s ease-in-out infinite alternate; }
.beam { animation: beam 14s ease-in-out infinite alternate; }
@keyframes rise { from { transform: translateY(0); } to { transform: translateY(-${H}px); } }
@keyframes sway { from { transform: translateX(-8px); } to { transform: translateX(8px); } }
@keyframes flicker { from { transform: scale(0.94, 0.9); } to { transform: scale(1.04, 1.06); } }
@keyframes wave { from { transform: skewX(-0.8deg); } to { transform: skewX(0.8deg); } }
@keyframes beam { from { opacity: 0.75; } to { opacity: 1; } }
</style>
<!-- the hall -->
<rect width="${W}" height="${H}" fill="url(#wall)"/>
<rect width="${W}" height="${H}" fill="url(#bees)"/>
<!-- pilasters -->
<rect x="8" y="70" width="22" height="760" fill="url(#gold)" opacity="0.8"/>
<rect x="290" y="70" width="22" height="760" fill="url(#gold)" opacity="0.8"/>
<rect x="1268" y="70" width="22" height="760" fill="url(#gold)" opacity="0.8"/>
<!-- cornice -->
<rect width="${W}" height="62" fill="#1a0507"/>
<rect y="58" width="${W}" height="12" fill="url(#gold)"/>
<path d="M0 74 H${W}" stroke="#c9a24a" stroke-width="2" stroke-dasharray="8 8"/>
<!-- the emblem high on the wall -->
<circle cx="800" cy="190" r="120" fill="url(#throneGlow)"/>
${laurel(800, 190, 70, 74, 26, 26)}
<text x="800" y="214" text-anchor="middle" font-family="serif" font-weight="700" font-size="76" fill="#e8c25a">N</text>
<!-- floor and carpet -->
<rect y="830" width="${W}" height="170" fill="url(#floor)"/>
<rect y="826" width="${W}" height="6" fill="url(#gold)"/>
<path d="M560 1000 L700 832 H1290 V1000 Z" fill="#8e1b2a"/>
<path d="M560 1000 L700 832 M590 1000 L724 832" stroke="url(#gold)" stroke-width="4"/>
<!-- light through a high window -->
<g class="beam"><path d="M180 70 L360 70 L1000 830 L620 830 Z" fill="url(#shaft)"/><path d="M420 70 L520 70 L1180 830 L960 830 Z" fill="url(#shaft)" opacity="0.7"/></g>
${dust()}
<!-- the war banner -->
${banner(percent, tokens, fill)}
<!-- candelabra -->
${candelabrum(160, 900)}
${throne()}
</svg>`
}
