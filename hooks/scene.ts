// Christmas night at the North Pole: a robin in a Santa hat on a hanging
// sign that shows the context window, a lit tree, a snowman, a lamp post,
// an A-frame cabin, and snow that piles up as the context window fills.

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

function stars(): string {
  const rand = rng(1225)
  let out = ''
  for (let i = 0; i < 110; i++) {
    const x = rand() * W
    const y = rand() * 560
    const r = 0.6 + rand() * 1.3
    const tw = rand() < 0.3 ? ` class="tw" style="animation-delay:-${r1(rand() * 6)}s"` : ''
    out += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" opacity="${r1(0.45 + rand() * 0.5)}"${tw}/>`
  }
  return `<g fill="#ffffff">${out}</g>`
}

// Each flake is drawn twice, one screen height apart, inside a group that
// slides down one screen height and repeats, so the fall never jumps.
// With motion off the group rests and the first copy shows in place.
function snow(seed: number, count: number, rMin: number, rMax: number, durMin: number, durMax: number, opacity: number): string {
  const rand = rng(seed)
  let out = ''
  for (let i = 0; i < count; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = rMin + rand() * (rMax - rMin)
    const dur = durMin + rand() * (durMax - durMin)
    const sway = 3 + rand() * 4
    out +=
      `<g class="fall" style="animation-duration:${r1(dur)}s;animation-delay:-${r1(rand() * dur)}s">` +
      `<g class="sway" style="animation-duration:${r1(sway)}s;animation-delay:-${r1(rand() * sway)}s">` +
      `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/><circle cx="${r1(x)}" cy="${r1(y - H)}" r="${r1(r)}"/>` +
      `</g></g>`
  }
  return `<g fill="#ffffff" opacity="${opacity}">${out}</g>`
}

// A small snowy pine, its foot at (x, y).
function pine(x: number, y: number, s: number, fill: string): string {
  const t = (w: number, top: number, bot: number): string =>
    `M${r1(x)} ${r1(y - top * s)} L${r1(x + w * s)} ${r1(y - bot * s)} L${r1(x - w * s)} ${r1(y - bot * s)} Z`
  return (
    `<path d="${t(34, 60, 0)} ${t(28, 95, 35)} ${t(20, 125, 70)}" fill="${fill}"/>` +
    `<path d="${t(12, 60, 46)} ${t(10, 95, 82)} ${t(8, 125, 113)}" fill="#dfe9fb" opacity="0.9"/>`
  )
}

function distantPines(): string {
  const rand = rng(77)
  let out = ''
  for (let x = -20; x < W + 40; x += 38 + rand() * 40) {
    out += pine(x, 705 + rand() * 25, 0.45 + rand() * 0.35, '#1a3150')
  }
  return out
}

// The decorated tree, left side.
function christmasTree(): string {
  const cx = 120
  const foot = 905
  const tiers = [
    { top: 420, bot: 560, w: 62 },
    { top: 500, bot: 680, w: 92 },
    { top: 600, bot: 800, w: 122 },
    { top: 700, bot: 890, w: 150 },
  ]
  let body = ''
  let caps = ''
  for (const { top, bot, w } of tiers) {
    body += `<path d="M${cx} ${top} L${cx + w} ${bot} Q${cx} ${bot + 14} ${cx - w} ${bot} Z" fill="#1d5a3c"/>`
    caps += `<path d="M${cx - w} ${bot} q ${r1(w * 0.25)} -16 ${r1(w * 0.5)} -4 q ${r1(w * 0.25)} -14 ${r1(w * 0.5)} 0 q ${r1(w * 0.25)} -16 ${r1(w * 0.5)} -2 q ${r1(w * 0.25)} -14 ${r1(w * 0.5)} 6 Q${cx} ${bot + 14} ${cx - w} ${bot} Z" fill="#eef4ff"/>`
  }
  const colours = ['#ffd25e', '#ff5d5d', '#5ef0b4', '#7cc4ff', '#ffa94d']
  const rand = rng(2512)
  let lights = ''
  let k = 0
  for (let y = 500; y <= 870; y += 34) {
    const half = 20 + (y - 440) * 0.33
    const n = Math.max(3, Math.round(half / 14))
    for (let i = 0; i <= n; i++) {
      const x = cx - half + (2 * half * i) / n
      const yy = y + Math.sin((i / n) * Math.PI) * 8
      const c = colours[k++ % colours.length] ?? '#ffd25e'
      lights += `<circle class="bulb" cx="${r1(x)}" cy="${r1(yy)}" r="3.4" fill="${c}" style="animation-delay:-${r1(rand() * 4)}s"/>`
    }
  }
  const star = `<path d="M${cx} 382 l9 22 h23 l-18 14 l7 23 l-21 -14 l-21 14 l7 -23 l-18 -14 h23 Z" fill="#ffd25e"/>`
  const trunk = `<rect x="${cx - 12}" y="888" width="24" height="${foot - 888}" fill="#4a3024"/>`
  return trunk + body + caps + lights + star
}

function presents(): string {
  const box = (x: number, y: number, w: number, h: number, c: string, ribbon: string): string =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>` +
    `<rect x="${x + w / 2 - 3}" y="${y}" width="6" height="${h}" fill="${ribbon}"/>` +
    `<rect x="${x}" y="${y + h / 2 - 3}" width="${w}" height="6" fill="${ribbon}"/>` +
    `<path d="M${x + w / 2} ${y} q -10 -12 -14 -2 q 4 6 14 2 q 10 -12 14 -2 q -4 6 -14 2" fill="${ribbon}"/>`
  return box(40, 868, 44, 36, '#c62f3a', '#ffd25e') + box(92, 880, 34, 26, '#2f7dd1', '#eef4ff') + box(150, 874, 40, 32, '#e6b33c', '#c62f3a')
}

function snowman(): string {
  const x = 225
  return (
    `<ellipse cx="${x}" cy="915" rx="44" ry="10" fill="#c9d8ee"/>` +
    `<circle cx="${x}" cy="878" r="38" fill="#f4f8ff"/>` +
    `<circle cx="${x}" cy="822" r="28" fill="#f4f8ff"/>` +
    `<circle cx="${x}" cy="778" r="21" fill="#f4f8ff"/>` +
    `<circle cx="${x - 7}" cy="773" r="2.6" fill="#1c2233"/><circle cx="${x + 7}" cy="773" r="2.6" fill="#1c2233"/>` +
    `<path d="M${x} 780 l18 4 l-18 3 Z" fill="#f08a24"/>` +
    `<circle cx="${x}" cy="812" r="2.8" fill="#1c2233"/><circle cx="${x}" cy="828" r="2.8" fill="#1c2233"/><circle cx="${x}" cy="866" r="3" fill="#1c2233"/>` +
    `<path d="M${x - 22} 794 q 22 10 44 0 l 0 9 q -22 10 -44 0 Z" fill="#d62835"/>` +
    `<path d="M${x + 10} 800 l 8 30 l 10 -2 l -6 -28 Z" fill="#d62835"/>` +
    `<rect x="${x - 27}" y="754" width="54" height="7" rx="2" fill="#1c2233"/>` +
    `<rect x="${x - 17}" y="722" width="34" height="34" fill="#1c2233"/>` +
    `<rect x="${x - 17}" y="745" width="34" height="6" fill="#d62835"/>` +
    `<path d="M${x - 26} 818 l -34 -20 M${x - 48} 805 l -6 -12 M${x + 26} 818 l 34 -22 M${x + 50} 803 l 4 -12" stroke="#5a3a26" stroke-width="3.5" stroke-linecap="round" fill="none"/>`
  )
}

function lampPost(): string {
  const x = 292
  return (
    `<circle cx="${x}" cy="690" r="60" fill="url(#warm)"/>` +
    `<rect x="${x - 3}" y="700" width="6" height="210" fill="#1c2233"/>` +
    `<rect x="${x - 10}" y="905" width="20" height="8" fill="#1c2233"/>` +
    `<path d="M${x - 13} 672 h26 l-4 34 h-18 Z" fill="#ffe7a3" stroke="#1c2233" stroke-width="3"/>` +
    `<path d="M${x - 16} 672 l16 -12 l16 12 Z" fill="#1c2233"/>` +
    `<path d="M${x - 18} 668 q 18 -16 36 0" fill="#eef4ff"/>` +
    `<path d="M${x + 3} 760 q 10 -8 12 4 q -4 8 -12 -4 M${x + 3} 760 l 6 14 M${x + 3} 760 l 12 10" stroke="#d62835" stroke-width="3" fill="none"/>`
  )
}

function lightsAlong(x1: number, y1: number, x2: number, y2: number, n: number): string {
  const colours = ['#ffd25e', '#ff5d5d', '#5ef0b4', '#7cc4ff']
  let out = ''
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1)
    out += `<circle class="bulb" cx="${r1(x1 + (x2 - x1) * t)}" cy="${r1(y1 + (y2 - y1) * t)}" r="3.2" fill="${colours[i % 4] ?? '#ffd25e'}" style="animation-delay:-${r1((i * 0.7) % 4)}s"/>`
  }
  return out
}

// The A-frame cabin, right side.
function cabin(): string {
  const cx = 1470
  const top = 600
  const foot = 905
  const half = 130
  return (
    `<circle cx="${cx}" cy="820" r="170" fill="url(#warm)"/>` +
    `<rect x="${cx + 52}" y="560" width="30" height="120" fill="#5b6478"/>` +
    `<rect x="${cx + 47}" y="552" width="40" height="12" fill="#eef4ff"/>` +
    `<path class="smoke" d="M${cx + 67} 545 q -8 -12 2 -22 q 10 -10 0 -22" stroke="#c9d6ea" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    `<path class="smoke b" d="M${cx + 67} 545 q -8 -12 2 -22 q 10 -10 0 -22" stroke="#c9d6ea" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    `<path d="M${cx} ${top - 22} L${cx + half + 28} ${foot} L${cx - half - 28} ${foot} Z" fill="#eef4ff"/>` +
    `<path d="M${cx} ${top} L${cx + half} ${foot} L${cx - half} ${foot} Z" fill="#7a4a2c"/>` +
    `<path d="M${cx} ${top + 30} L${cx + half - 18} ${foot} M${cx} ${top + 30} L${cx - half + 18} ${foot}" stroke="#5c3520" stroke-width="5"/>` +
    `<path d="M${cx} ${top + 50} L${cx + 52} 770 L${cx - 52} 770 Z" fill="#ffd27a"/>` +
    `<path d="M${cx} ${top + 50} V770 M${cx - 36} 730 H${cx + 36} M${cx - 18} 690 H${cx + 18}" stroke="#7a4a2c" stroke-width="4"/>` +
    lightsAlong(cx, top - 10, cx - half - 20, foot - 8, 11) +
    lightsAlong(cx, top - 10, cx + half + 20, foot - 8, 11) +
    `<rect x="${cx - 92}" y="770" width="184" height="10" fill="#5c3520"/>` +
    `<rect x="${cx - 92}" y="764" width="184" height="7" fill="#eef4ff"/>` +
    `<rect x="${cx - 88}" y="810" width="38" height="44" fill="#ffd27a"/><rect x="${cx + 50}" y="810" width="38" height="44" fill="#ffd27a"/>` +
    `<path d="M${cx - 69} 810 V854 M${cx - 88} 832 H${cx - 50} M${cx + 69} 810 V854 M${cx + 50} 832 H${cx + 88}" stroke="#5c3520" stroke-width="3"/>` +
    `<path d="M${cx - 92} 806 h46 v-6 h-46 Z M${cx + 46} 806 h46 v-6 h-46 Z" fill="#eef4ff"/>` +
    `<rect x="${cx - 26}" y="800" width="52" height="${foot - 800}" fill="#8e1b2a"/>` +
    `<circle cx="${cx}" cy="830" r="14" fill="none" stroke="#2f8a52" stroke-width="7"/>` +
    `<circle cx="${cx - 8}" cy="822" r="2.5" fill="#ff5d5d"/><circle cx="${cx + 9}" cy="826" r="2.5" fill="#ffd25e"/><circle cx="${cx + 2}" cy="840" r="2.5" fill="#ff5d5d"/>` +
    `<path d="M${cx - 5} 842 l5 6 l5 -6 Z" fill="#d62835"/>` +
    `<circle cx="${cx + 16}" cy="860" r="2.5" fill="#ffd25e"/>` +
    `<path d="M${cx - 40} ${foot} h80 v-8 h-80 Z" fill="#eef4ff"/>`
  )
}

function clean(s: string): string {
  return s.replace(/[^A-Za-z0-9%. -]/g, '')
}

// The hanging sign with the robin: context fill on top, tokens below.
function sign(percent: number | undefined, tokens: number | undefined, depth: number): string {
  const x = 130
  const big = percent === undefined ? '-' : `${percent}%`
  const small = tokens === undefined ? '-' : tokens >= 1000 ? `${Math.round(tokens / 1000)}k` : `${tokens}`
  const capTop = r1(4 + depth * 12)
  const capLow = r1(3 + depth * 8)
  return (
    `<g transform="translate(0 50)"><g class="swing">` +
    `<path d="M${x - 44} -60 V140 M${x + 44} -60 V140 M${x - 34} 200 V232 M${x + 34} 200 V232" stroke="#c9a46a" stroke-width="3"/>` +
    `<rect x="${x - 60}" y="138" width="120" height="64" rx="6" fill="#7a4f2e" stroke="#4a2e1a" stroke-width="3"/>` +
    `<path d="M${x - 62} 140 q 31 -${capTop} 62 -4 q 31 -${capTop} 62 4 Z" fill="#f4f8ff"/>` +
    `<text x="${x}" y="182" text-anchor="middle" font-family="monospace" font-weight="700" font-size="34" fill="#fff4d6">${clean(big)}</text>` +
    `<text x="${x}" y="197" text-anchor="middle" font-family="monospace" font-size="12" fill="#f1dcb4">context</text>` +
    `<rect x="${x - 50}" y="232" width="100" height="46" rx="6" fill="#7a4f2e" stroke="#4a2e1a" stroke-width="3"/>` +
    `<path d="M${x - 52} 234 q 26 -${capLow} 52 -3 q 26 -${capLow} 52 3 Z" fill="#f4f8ff"/>` +
    `<text x="${x}" y="258" text-anchor="middle" font-family="monospace" font-weight="700" font-size="18" fill="#fff4d6">${clean(small)}</text>` +
    `<text x="${x}" y="272" text-anchor="middle" font-family="monospace" font-size="11" fill="#f1dcb4">tokens</text>` +
    `<g transform="translate(${x - 4} ${r1(112 - depth * 8)})">` +
    `<ellipse cx="0" cy="0" rx="26" ry="22" fill="#7a5134"/>` +
    `<ellipse cx="10" cy="4" rx="15" ry="15" fill="#e2582b"/>` +
    `<path d="M-24 0 q -18 4 -22 -8 q 12 -2 22 0 Z" fill="#5e3d27"/>` +
    `<circle cx="14" cy="-10" r="3" fill="#1c2233"/><circle cx="15" cy="-11" r="1" fill="#ffffff"/>` +
    `<path d="M24 -6 l10 3 l-10 3 Z" fill="#f2a33c"/>` +
    `<path d="M-6 21 v6 M6 21 v6" stroke="#5e3d27" stroke-width="2.5"/>` +
    `<path d="M-14 -16 Q 0 -50 26 -40 Q 14 -30 16 -18 Z" fill="#d62835"/>` +
    `<rect x="-16" y="-20" width="34" height="8" rx="4" fill="#f4f8ff"/>` +
    `<circle cx="27" cy="-40" r="6" fill="#f4f8ff"/>` +
    `</g>` +
    `</g></g>`
  )
}

// Snow banked along the bottom, higher as the context window fills.
function drift(fill: number): string {
  const h = 28 + fill * 250
  const top = H - h
  const rand = rng(31)
  let d = `M0 ${r1(top + 14)}`
  for (let x = 0; x < W; x += 100) {
    d += ` Q${x + 50} ${r1(top + (rand() - 0.5) * 26 - 10)} ${x + 100} ${r1(top + 14 + (rand() - 0.5) * 16)}`
  }
  d += ` L${W} ${H} L0 ${H} Z`
  return `<path d="${d}" fill="url(#drift)"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.7"/>`
}

export function buildScene(percent: number | undefined, tokens: number | undefined): string {
  const fill = Math.min(1, Math.max(0, (percent ?? 0) / 100))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1330"/><stop offset="0.6" stop-color="#16244d"/><stop offset="1" stop-color="#26386a"/></linearGradient>
<linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a7e"/><stop offset="1" stop-color="#25335f"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3d2ec"/><stop offset="1" stop-color="#9fb3d8"/></linearGradient>
<linearGradient id="drift" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f9ff"/><stop offset="1" stop-color="#cfdcf2"/></linearGradient>
<radialGradient id="moonGlow"><stop offset="0" stop-color="#fff6d8" stop-opacity="0.45"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
<radialGradient id="warm"><stop offset="0" stop-color="#ffc35c" stop-opacity="0.45"/><stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></radialGradient>
</defs>
<style>
.tw { animation: twinkle 5s ease-in-out infinite alternate; }
.bulb { animation: glow 4s ease-in-out infinite alternate; }
.fall { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
.sway { animation-name: sway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
.smoke { opacity: 0.5; animation: rise 9s ease-out infinite; }
.smoke.b { animation-delay: -4.5s; }
.swing { transform-origin: 130px -60px; animation: swing 7s ease-in-out infinite alternate; }
@keyframes twinkle { from { opacity: 0.3; } to { opacity: 1; } }
@keyframes glow { from { opacity: 0.55; } to { opacity: 1; } }
@keyframes fall { from { transform: translateY(0); } to { transform: translateY(${H}px); } }
@keyframes sway { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
@keyframes rise { from { transform: translate(0, 0); opacity: 0.7; } to { transform: translate(18px, -60px); opacity: 0; } }
@keyframes swing { from { transform: rotate(-1.5deg); } to { transform: rotate(1.5deg); } }
</style>
<!-- sky -->
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${stars()}
<!-- moon -->
<circle cx="1440" cy="215" r="110" fill="url(#moonGlow)"/>
<circle cx="1440" cy="215" r="40" fill="#f3ecd2"/>
<circle cx="1426" cy="204" r="7" fill="#e2d8b8"/><circle cx="1452" cy="228" r="5" fill="#e2d8b8"/><circle cx="1448" cy="198" r="3.5" fill="#e2d8b8"/>
${snow(11, 50, 0.8, 1.6, 30, 42, 0.5)}
<!-- mountains -->
<path d="M-20 720 L140 520 L250 610 L420 450 L600 640 L760 500 L900 620 L1060 470 L1220 610 L1360 520 L1520 640 L1640 560 L1640 760 L-20 760 Z" fill="url(#mtn)"/>
<path d="M140 520 L112 556 L132 550 L150 566 L170 545 Z M420 450 L388 490 L410 482 L428 500 L452 480 Z M1060 470 L1030 506 L1052 500 L1070 516 L1090 496 Z M1360 520 L1334 552 L1354 546 L1370 560 L1390 542 Z" fill="#dfe8fa" opacity="0.85"/>
${distantPines()}
<!-- ground -->
<path d="M0 760 C 300 735, 600 770, 900 752 S 1400 740, 1600 756 L1600 1000 L0 1000 Z" fill="url(#ground)"/>
${snow(22, 35, 1.6, 2.6, 18, 26, 0.75)}
<!-- left corner -->
${christmasTree()}
${presents()}
${snowman()}
${lampPost()}
${pine(330, 915, 0.9, '#1d4a3a')}
<!-- right corner -->
${pine(1290, 905, 1.0, '#1d4a3a')}
${pine(1335, 915, 0.75, '#1d4a3a')}
${cabin()}
<!-- the hanging sign -->
${sign(percent, tokens, fill)}
<!-- the drift that grows -->
${drift(fill)}
${snow(33, 22, 2.8, 4.2, 12, 17, 0.9)}
</svg>`
}
