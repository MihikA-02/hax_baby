import {
  C, E, P, RC, G, L, at, place, rng, star, sparkle, cloud, land, leaf, petals, pine, reg,
} from '../projects/paint/art-helpers';

/**
 * Zoobi Colours the Universe — six cinematic scenes authored as layered, region-based SVG data.
 *  • `regions`   back-to-front, each independently colourable (brush reveal or bloom "pop")
 *  • `extras`    ambient life that only appears once the scene is finished (water, snow, fireflies…)
 *  • `amb`       ambient behaviour applied after the reveal (see projects.css .zp-amb-*)
 *  • `captions`  the cinematic narration shown while Zoobi paints
 */
const BASE = { viewBox: '0 0 800 600', paper: '#fbf7ee', ink: '#34283f', inkDone: 0.22, lead: 2200 };
const particles = (n, seed, make) => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => make(i, r));
};

/* ───────── 1 · The Whispering Waterfall ───────── */
const wfFlowers = [[120, 548, 15], [200, 566, 12], [610, 560, 14], [700, 540, 16], [760, 572, 11]];
const waterfall = {
  ...BASE,
  id: 'whispering-waterfall',
  title: 'The Whispering Waterfall',
  blurb: 'Turquoise water tumbles over mossy stone into a pool that never stops humming.',
  alt: 'A waterfall pouring into a turquoise pool between mossy rocks, ferns and small flowers',
  captions: ['The stones are waiting for their colours…', 'Water first — cool turquoise, falling all the way down.', 'Now the green creeps in.', 'Listen. It is whispering.'],
  gradients: {
    sky: { stops: [[0, '#b7e4ff'], [1, '#effbf2']] },
    water: { stops: [[0, '#f0fdff'], [0.45, '#8fe6ee'], [1, '#27b3c9']] },
    pool: { stops: [[0, '#7fe3e0'], [1, '#1b98b6']] },
    rock: { stops: [[0, '#a69584'], [1, '#6f6358']] },
    far: { stops: [[0, '#a8d8a8'], [1, '#74b98d']] },
  },
  regions: [
    reg('sky', 'g:sky', 0, 1400, [RC(0, 0, 800, 600)]),
    reg('sun', '#ffd45e', 900, 800, [C(690, 74, 34)], { kind: 'pop', amb: 'glow' }),
    reg('farHills', 'g:far', 1400, 1300, [land([[0, 235], [120, 190], [260, 220], [400, 185], [560, 215], [700, 180], [800, 215]], 600)]),
    reg('cliffs', 'g:rock', 2200, 1500, [
      G([[0, 125], [90, 98], [180, 118], [270, 94], [336, 102], [340, 425], [0, 435]]),
      G([[800, 112], [710, 92], [620, 114], [540, 90], [464, 102], [460, 425], [800, 435]]),
      L('M20,210 L150,200'), L('M30,290 L190,282'), L('M640,200 L780,208'), L('M610,285 L770,292'),
    ]),
    reg('pool', 'g:pool', 3500, 1200, [E(400, 462, 345, 96)]),
    reg('waterfall', 'g:water', 4000, 1900, [P('M336,98 L464,98 L470,335 Q474,400 400,410 Q326,400 330,335 Z')]),
    reg('foam', '#ffffff', 5700, 1300, [RC(352, 122, 9, 112, 4.5), RC(380, 106, 8, 144, 4), RC(408, 114, 10, 150, 5), RC(436, 128, 8, 102, 4), RC(366, 256, 8, 84, 4), RC(424, 268, 9, 72, 4.5)]),
    reg('mist', '#ffffff', 6600, 900, [cloud(400, 428, 210), cloud(335, 438, 90), cloud(468, 440, 90)], { amb: 'float' }),
    reg('boulders', 'g:rock', 6800, 1100, [E(110, 478, 84, 50), E(235, 528, 72, 38), E(690, 486, 92, 52), E(580, 542, 62, 30)]),
    reg('moss', '#7bc46a', 7500, 1300, [E(108, 452, 62, 22), E(230, 512, 48, 14), E(690, 460, 70, 24), E(120, 112, 90, 14), E(660, 108, 100, 14), E(578, 530, 40, 11)]),
    reg('ground', '#5aa85e', 7200, 1100, [land([[0, 565], [200, 548], [420, 578], [640, 552], [800, 566]], 600)]),
    reg('bushes', '#4f9e5c', 8300, 1400, [C(46, 392, 62), C(112, 380, 46), C(70, 440, 50), C(752, 396, 66), C(690, 384, 46), C(740, 446, 52)], { amb: 'sway' }),
    reg('ferns', '#2f8a58', 9100, 1300, [leaf(30, 560, 120, 20, -70), leaf(30, 560, 105, 18, -40), leaf(30, 560, 100, 17, -100), leaf(780, 560, 120, 20, -110), leaf(780, 560, 105, 18, -140), leaf(780, 560, 100, 17, -80)], { amb: 'sway' }),
    reg('flowers', '#ff8fbf', 9900, 1000, wfFlowers.flatMap(([x, y, r]) => petals(x, y, r, 5, r * 0.34)), { kind: 'pop', stagger: 60, amb: 'sway' }),
    reg('flowerCentres', '#ffd45e', 10700, 400, wfFlowers.map(([x, y, r]) => C(x, y, r * 0.3)), { kind: 'pop' }),
    reg('sparkles', '#fffbe0', 11000, 700, [sparkle(560, 160, 14), sparkle(250, 330, 12), sparkle(610, 395, 12)], { kind: 'pop', amb: 'twinkle' }),
  ],
  extras: [
    ...[355, 385, 413, 441].map((x, i) => ({ id: `flow${i}`, amb: 'flow', stroke: '#ffffff', strokeWidth: 3, opacity: 0.85, shapes: [L(`M${x},${112 + i * 14} L${x},${190 + i * 14}`)], style: { '--delay': `${-i * 0.45}s` } })),
    ...[0, 1, 2].map((i) => ({ id: `ripple${i}`, amb: 'ripple', stroke: '#ffffff', strokeWidth: 2.5, opacity: 0.8, shapes: [E(400, 452, 110, 22)], style: { '--delay': `${-i * 1.4}s` } })),
    ...[[372, 408], [428, 410], [398, 396], [450, 402]].map(([x, y], i) => ({ id: `drop${i}`, amb: 'drop', fill: '#e9fdff', shapes: [C(x, y, 4)], style: { '--delay': `${-i * 0.7}s` } })),
  ],
};

/* ───────── 2 · The Blooming Garden ───────── */
const gFlowers = [
  { x: 110, y: 405, r: 42, c: '#ff8fbf', n: 6 },
  { x: 215, y: 372, r: 34, c: '#ffd45e', n: 8 },
  { x: 300, y: 430, r: 38, c: '#b794f4', n: 5 },
  { x: 540, y: 400, r: 42, c: '#ff9b54', n: 7 },
  { x: 635, y: 365, r: 36, c: '#ff8fbf', n: 6 },
  { x: 725, y: 425, r: 40, c: '#7fd0f5', n: 6 },
];
const gStem = (x, y) => P(`M${x - 4},560 Q${x - 6},${(y + 560) / 2} ${x - 2},${y + 8} L${x + 2},${y + 8} Q${x + 6},${(y + 560) / 2} ${x + 4},560 Z`);
const wingsOf = (cx, cy, s, rot) => {
  const T = `translate(${cx} ${cy}) rotate(${rot}) scale(${s})`;
  const up = P('M0,-8 C-30,-72 -112,-84 -106,-26 C-102,6 -46,14 0,-4 Z');
  const lo = P('M0,2 C-55,6 -98,34 -78,76 C-58,102 -16,62 0,14 Z');
  return { wings: [at(up, T), at(up, `${T} scale(-1 1)`), at(lo, T), at(lo, `${T} scale(-1 1)`)], body: [at(E(0, 12, 7, 34), T)] };
};
const bf1 = wingsOf(330, 250, 0.55, 15);
const bf2 = wingsOf(590, 215, 0.48, -20);
const cap = (x, y, s) => ({
  cap: at(P('M-46,0 C-46,-48 -22,-70 0,-70 C22,-70 46,-48 46,0 C20,10 -20,10 -46,0 Z'), `translate(${x} ${y}) scale(${s})`),
  stalk: at(P('M-14,2 C-10,18 -12,34 -16,46 L16,46 C12,34 10,18 14,2 Z'), `translate(${x} ${y}) scale(${s})`),
});
const gm1 = cap(235, 538, 0.62);
const gm2 = cap(668, 548, 0.7);
const garden = {
  ...BASE,
  id: 'blooming-garden',
  title: 'The Blooming Garden',
  blurb: 'Every bed wakes up at once: petals opening, butterflies lifting, pollen drifting by.',
  alt: 'A cottage garden with flowers, a winding path, mushrooms and two butterflies',
  captions: ['A garden, sleeping in outline…', 'Soil, leaves, and then — one flower at a time.', 'Petals open. Butterflies wake.', 'Hello, little garden.'],
  gradients: {
    sky: { stops: [[0, '#c9e8ff'], [1, '#fff6dd']] },
    soil: { stops: [[0, '#9b6a45'], [1, '#6e452b']] },
    lawn: { stops: [[0, '#9bdc80'], [1, '#67b86b']] },
  },
  regions: [
    reg('sky', 'g:sky', 0, 1300, [RC(0, 0, 800, 600)]),
    reg('hedge', '#5fae6a', 1100, 1300, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => C(40 + i * 80, 318 - (i % 2) * 10, 52))),
    reg('lawn', 'g:lawn', 2200, 1200, [land([[0, 345], [200, 330], [420, 350], [620, 326], [800, 342]], 600)]),
    reg('soil', 'g:soil', 3000, 1300, [E(185, 488, 200, 62), E(615, 492, 215, 66)]),
    reg('path', '#f6e1b6', 4000, 1100, [P('M330,600 C308,528 480,490 420,430 C390,400 412,370 430,350 L470,350 C470,376 452,398 482,430 C546,492 472,548 566,600 Z')]),
    reg('stems', '#4fa36a', 5000, 1000, gFlowers.map((f) => gStem(f.x, f.y))),
    reg('leaves', '#69be72', 5600, 1300, gFlowers.flatMap((f) => [leaf(f.x, 520, 62, 15, f.x < 400 ? -150 : -30), leaf(f.x, 495, 54, 13, f.x < 400 ? -30 : -150)]), { amb: 'sway' }),
    ...gFlowers.map((f, i) => reg(`bloom${i}`, f.c, 6600 + i * 650, 1100, petals(f.x, f.y, f.r, f.n, f.r * 0.3, i * 9), { kind: 'pop', stagger: 90, amb: 'sway' })),
    reg('bloomCentres', '#ffe08a', 10500, 600, gFlowers.map((f) => C(f.x, f.y, f.r * 0.25)), { kind: 'pop', stagger: 80 }),
    reg('mushCaps', '#ff6f7a', 10800, 700, [gm1.cap, gm2.cap], { kind: 'pop' }),
    reg('mushStalks', '#fff1d9', 10700, 500, [gm1.stalk, gm2.stalk]),
    reg('butterflyWings1', '#ff9bd0', 11200, 900, [bf1.wings], { amb: 'float' }),
    reg('butterflyWings2', '#7fd0f5', 11700, 900, [bf2.wings], { amb: 'float' }),
    reg('butterflyBodies', '#5a3a6e', 12300, 400, [bf1.body, bf2.body], { kind: 'pop', amb: 'float' }),
  ],
  extras: particles(14, 21, (i, r) => ({ id: `pollen${i}`, amb: 'pollen', fill: '#fff3a6', opacity: 0.9, shapes: [C(80 + r() * 640, 250 + r() * 260, 2.5 + r() * 2)], style: { '--delay': `${-r() * 8}s`, '--dur': `${7 + r() * 5}s` } })),
};

/* ───────── 3 · The Sky of a Thousand Hues ───────── */
const skyScene = {
  ...BASE,
  id: 'sky-of-a-thousand-hues',
  title: 'The Sky of a Thousand Hues',
  blurb: 'A sunrise that cannot decide on a single colour — so it chooses all of them.',
  alt: 'A wide sky at sunrise with clouds, a golden sun, rolling green hills and distant birds',
  captions: ['An empty sky, holding its breath…', 'Blue first. Then peach, pink and lavender at the horizon.', 'Clouds take the light.', 'The whole sky glows.'],
  gradients: {
    sky: { stops: [[0, '#79b8ff'], [0.4, '#b9dcff'], [0.65, '#ffd6e6'], [0.85, '#ffc9a3'], [1, '#ffe7b3']] },
    haze: { type: 'radial', stops: [[0, '#fff0b8', 0.95], [0.6, '#ffc9a3', 0.5], [1, '#ffc9a3', 0]] },
    sunGlow: { type: 'radial', stops: [[0, '#fff6c0', 0.9], [1, '#ffe08a', 0]] },
    sun: { type: 'radial', stops: [[0, '#fff7c8'], [1, '#ffc94a']] },
  },
  regions: [
    reg('sky', 'g:sky', 0, 2200, [RC(0, 0, 800, 600)]),
    reg('haze', 'g:haze', 2200, 1600, [E(400, 440, 520, 170)], { overlay: true }),
    reg('cloudsBack', '#ffe6ee', 3200, 1200, [cloud(150, 170, 240), cloud(660, 120, 200)], { amb: 'drift', ambX: 40 }),
    reg('cloudsMid', '#ffffff', 3900, 1300, [cloud(420, 210, 280), cloud(120, 290, 170)], { amb: 'drift', ambX: -50 }),
    reg('cloudsWarm', '#ffd0b8', 4800, 1100, [cloud(600, 300, 230), cloud(310, 105, 130)], { amb: 'drift', ambX: 35 }),
    reg('sunGlow', 'g:sunGlow', 5500, 900, [C(400, 438, 150)], { overlay: true, kind: 'pop', amb: 'glow' }),
    reg('sun', 'g:sun', 5800, 900, [C(400, 438, 56)], { kind: 'pop', amb: 'glow' }),
    reg('hillsFar', '#9ad2a4', 6600, 1300, [land([[0, 430], [160, 405], [330, 440], [520, 410], [700, 432], [800, 415]], 600)]),
    reg('hillsMid', '#72c183', 7400, 1300, [land([[0, 490], [180, 458], [380, 495], [580, 462], [800, 490]], 600)]),
    reg('hillsNear', '#4fa563', 8200, 1300, [land([[0, 548], [220, 520], [430, 552], [640, 524], [800, 548]], 600)]),
    reg('birds', '#5a4b6b', 9200, 900, [[560, 150], [610, 128], [650, 160], [180, 120]].map(([x, y]) => at(P('M0,0 Q8,-9 16,0 Q24,-9 32,0 Q24,-3 16,5 Q8,-3 0,0 Z'), `translate(${x} ${y})`)), { kind: 'pop', stagger: 140, amb: 'float' }),
  ],
  extras: [
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ id: `ray${i}`, amb: 'shimmer', fill: '#fff6c0', opacity: 0.22, shapes: [G([[400, 438], [400 + (i - 2.5) * 190 - 30, 120], [400 + (i - 2.5) * 190 + 30, 120]])], style: { '--delay': `${-i * 0.8}s` } })),
  ],
};

/* ───────── 4 · The Moonlight Kingdom ───────── */
const rn4 = rng(44);
const kStars = Array.from({ length: 46 }, () => [30 + rn4() * 740, 24 + rn4() * 270, 3 + rn4() * 6]).filter(([x, y]) => Math.hypot(x - 195, y - 130) > 96);
const moonlight = {
  ...BASE,
  id: 'moonlight-kingdom',
  title: 'The Moonlight Kingdom',
  blurb: 'Silver moonlight on a sleeping castle, and a handful of fireflies keeping watch.',
  alt: 'A castle on a hill under a crescent moon, with stars, clouds, mountains and fireflies',
  captions: ['Night has not arrived yet…', 'Indigo and violet pour in from the top.', 'One by one, the stars.', 'The kingdom sleeps — softly lit.'],
  gradients: {
    night: { stops: [[0, '#171649'], [0.55, '#3b2a86'], [1, '#7a4fb8']] },
    moon: { stops: [[0, '#fffbe0'], [1, '#e8e4ff']] },
    halo: { type: 'radial', stops: [[0, '#fffbe0', 0.55], [1, '#c9b8ff', 0]] },
  },
  regions: [
    reg('sky', 'g:night', 0, 2200, [RC(0, 0, 800, 600)]),
    reg('halo', 'g:halo', 2400, 900, [C(195, 132, 120)], { overlay: true, kind: 'pop', amb: 'glow' }),
    reg('moon', 'g:moon', 2700, 1100, [P('M200,52 A82,82 0 0 0 200,216 A116,116 0 0 1 200,52 Z')], { amb: 'glow' }),
    reg('clouds', '#8d7bd6', 3500, 1200, [cloud(420, 170, 240), cloud(660, 120, 160), cloud(120, 330, 200)], { amb: 'drift', ambX: 45 }),
    reg('farRange', '#5a4fb4', 4300, 1300, [land([[0, 400], [120, 320], [250, 395], [380, 300], [520, 400], [660, 320], [800, 390]], 600)]),
    reg('midRange', '#41398f', 5000, 1300, [land([[0, 450], [160, 390], [330, 445], [500, 385], [680, 440], [800, 405]], 600)]),
    reg('castle', '#a28be0', 5900, 1300, [RC(520, 330, 150, 110, 4), RC(498, 290, 38, 150, 3), RC(654, 290, 38, 150, 3), RC(562, 262, 66, 100, 3)]),
    reg('castleRoofs', '#6b4fc7', 6700, 800, [G([[490, 292], [517, 232], [544, 292]]), G([[646, 292], [673, 232], [700, 292]]), G([[554, 264], [595, 190], [636, 264]])]),
    reg('nearRange', '#2c2670', 6400, 1300, [land([[0, 505], [200, 455], [380, 500], [560, 462], [800, 495]], 600)]),
    reg('pines', '#1f4a58', 7300, 1000, [pine(70, 520, 110, 70), pine(135, 530, 85, 54), pine(710, 520, 105, 66), pine(760, 535, 80, 52), pine(330, 548, 70, 46)]),
    reg('stars', '#ffe9a0', 4800, 2000, kStars.map(([x, y, r]) => star(x, y, r)), { kind: 'pop', stagger: 60, amb: 'twinkle' }),
    reg('windows', '#ffd66b', 8100, 800, [RC(510, 340, 14, 22, 3), RC(646, 340, 14, 22, 3), RC(584, 285, 18, 26, 8), RC(535, 392, 14, 22, 3), RC(620, 392, 14, 22, 3)], { kind: 'pop', stagger: 120, amb: 'glow' }),
    reg('lanterns', '#fff08a', 8700, 700, [C(250, 520, 7), C(300, 530, 6), C(490, 520, 7)], { kind: 'pop', stagger: 120, amb: 'glow' }),
  ],
  extras: particles(11, 61, (i, r) => ({ id: `ff${i}`, amb: 'firefly', fill: '#fff6a0', shapes: [C(60 + r() * 680, 380 + r() * 170, 3)], style: { '--delay': `${-r() * 9}s`, '--dur': `${8 + r() * 6}s`, '--dx': `${(r() - 0.5) * 90}px`, '--dy': `${(r() - 0.5) * 60}px` } })),
};

/* ───────── 5 · The Sleeping Snowlands ───────── */
const snowParts = particles(26, 7, (i, r) => ({ id: `snow${i}`, amb: 'fall', fill: '#ffffff', opacity: 0.92, shapes: [C(20 + r() * 760, -10, 2 + r() * 3.2)], style: { '--delay': `${-r() * 10}s`, '--dur': `${9 + r() * 7}s`, '--dx': `${(r() - 0.5) * 80}px` } }));
const snowlands = {
  ...BASE,
  id: 'sleeping-snowlands',
  title: 'The Sleeping Snowlands',
  blurb: 'Blue shadows, soft white snow and a stream frozen mid-whisper.',
  alt: 'Snow-covered mountains, pine trees and a frozen stream under a pale winter sky',
  captions: ['A cold, quiet outline…', 'Blue shadows settle first. Then the snow.', 'Pines wake up green and frosted.', 'Shh. The snowlands are sleeping.'],
  gradients: {
    sky: { stops: [[0, '#cfe3ff'], [1, '#f6fbff']] },
    ice: { stops: [[0, '#d8f6ff'], [1, '#78c8ee']] },
    drift: { stops: [[0, '#ffffff'], [1, '#e1eefc']] },
  },
  regions: [
    reg('sky', 'g:sky', 0, 1500, [RC(0, 0, 800, 600)]),
    reg('paleSun', '#fff3c4', 1200, 700, [C(640, 90, 30)], { kind: 'pop', amb: 'glow' }),
    reg('mountains', '#9db6e4', 1800, 1500, [G([[-60, 440], [170, 150], [400, 440]]), G([[260, 440], [520, 110], [790, 440]]), G([[560, 440], [720, 220], [880, 440]])]),
    reg('shade', '#7f9ad2', 3000, 1100, [G([[170, 150], [400, 440], [255, 440]]), G([[520, 110], [790, 440], [600, 440]]), G([[720, 220], [880, 440], [770, 440]])]),
    reg('snowCaps', '#ffffff', 4000, 1800, [G([[170, 150], [128, 232], [152, 222], [170, 244], [192, 224], [214, 234]]), G([[520, 110], [462, 220], [492, 208], [520, 238], [548, 210], [584, 224]]), G([[720, 220], [690, 275], [708, 266], [722, 282], [740, 268], [752, 276]])]),
    reg('slopes', 'g:drift', 5000, 1300, [land([[0, 470], [160, 440], [350, 480], [560, 445], [800, 470]], 600)]),
    reg('stream', 'g:ice', 6000, 1500, [P('M330,600 C300,545 470,525 410,488 C372,466 440,452 520,444 L560,470 C480,478 430,490 470,512 C540,545 480,570 560,600 Z')]),
    reg('pines', '#3f9a72', 7300, 1500, [pine(70, 540, 150, 90), pine(150, 560, 110, 66), pine(240, 530, 90, 56), pine(655, 548, 140, 84), pine(735, 560, 110, 66), pine(585, 520, 80, 50)], { amb: 'sway' }),
    reg('frost', '#eaf6ff', 8700, 900, [G([[70, 392], [48, 430], [92, 430]]), G([[655, 408], [632, 446], [678, 446]]), G([[150, 450], [132, 478], [168, 478]]), G([[735, 450], [716, 478], [754, 478]])], { kind: 'pop', stagger: 120 }),
    reg('foreground', '#ffffff', 9000, 1200, [land([[0, 565], [200, 548], [430, 578], [640, 552], [800, 568]], 600)]),
    reg('glints', '#ffffff', 10000, 900, [sparkle(420, 520, 12), sparkle(500, 468, 10), sparkle(210, 500, 11), sparkle(120, 470, 9), sparkle(600, 520, 11)], { kind: 'pop', stagger: 110, amb: 'twinkle' }),
  ],
  extras: snowParts,
};

/* ───────── 6 · Planet Earth Awakens ───────── */
const rn6 = rng(66);
const spaceStars = Array.from({ length: 56 }, () => [20 + rn6() * 760, 18 + rn6() * 564, 2 + rn6() * 4.5]).filter(([x, y]) => Math.hypot(x - 400, y - 310) > 208);
const landBand = [
  P('M250,260 C270,215 330,215 345,250 C362,285 330,320 300,330 C270,338 235,300 250,260 Z'),
  P('M390,330 C415,300 455,310 470,345 C482,385 455,430 425,440 C395,445 375,380 390,330 Z'),
  P('M485,235 C515,205 575,215 590,255 C600,290 560,305 525,298 C490,292 470,260 485,235 Z'),
  P('M300,395 C325,380 360,395 365,420 C368,448 335,462 312,448 C292,435 285,408 300,395 Z'),
];
const cloudBand = [E(300, 280, 60, 12, -8), E(430, 235, 70, 11, 6), E(520, 340, 62, 12, -4), E(360, 390, 70, 11, 4), E(470, 440, 50, 10, -10)];
const earth = {
  ...BASE,
  id: 'planet-earth-awakens',
  title: 'Planet Earth Awakens',
  blurb: 'A small blue world turning slowly in the dark, glad to be seen.',
  alt: 'Planet Earth with blue oceans, green continents and white clouds in deep space with stars and nebulae',
  captions: ['Just a circle in the dark…', 'Deep indigo, then ocean blue.', 'Continents rise. Clouds follow.', 'Hello, little blue world.'],
  clips: { planet: C(400, 310, 175) },
  gradients: {
    space: { stops: [[0, '#07061f'], [1, '#2a1b6e']] },
    ocean: { type: 'radial', cx: 0.38, cy: 0.35, r: 0.8, stops: [[0, '#8fdcff'], [0.55, '#2a82e0'], [1, '#0f3f9e']] },
    atmo: { type: 'radial', stops: [[0.82, '#8fd3ff', 0.0], [0.9, '#8fd3ff', 0.55], [1, '#8fd3ff', 0]] },
    nebA: { type: 'radial', stops: [[0, '#b36bff', 0.55], [1, '#b36bff', 0]] },
    nebB: { type: 'radial', stops: [[0, '#ff7fc4', 0.45], [1, '#ff7fc4', 0]] },
    night: { stops: [[0, '#000018', 0], [1, '#000018', 0.55]], x1: 0.2, y1: 0.2, x2: 1, y2: 0.9 },
  },
  regions: [
    reg('space', 'g:space', 0, 2200, [RC(0, 0, 800, 600)]),
    reg('nebulae', 'g:nebA', 2300, 1500, [E(150, 140, 190, 100, -20)], { overlay: true }),
    reg('nebulaeB', 'g:nebB', 2900, 1400, [E(660, 480, 200, 105, 24)], { overlay: true }),
    reg('atmosphere', 'g:atmo', 4200, 1200, [C(400, 310, 205)], { overlay: true, kind: 'pop', amb: 'glow' }),
    reg('ocean', 'g:ocean', 4300, 2000, [C(400, 310, 175)]),
    reg('continents', '#5cbf6a', 6000, 1800, [...landBand, ...place(landBand, 'translate(350 0)')], { clip: 'planet', amb: 'rotate', ambX: -350, ambDur: 120 }),
    reg('clouds', '#ffffff', 7600, 1500, [...cloudBand, ...place(cloudBand, 'translate(350 0)')], { clip: 'planet', amb: 'rotate', ambX: -350, ambDur: 170, opacity: 0.88 }),
    reg('terminator', 'g:night', 8600, 900, [C(400, 310, 175)], { overlay: true, clip: 'planet' }),
    reg('stars', '#fff6c8', 9000, 1600, spaceStars.map(([x, y, r]) => star(x, y, r, r * 0.4, 4)), { kind: 'pop', stagger: 45, amb: 'twinkle' }),
    reg('moon', '#d9d6e6', 10400, 700, [C(660, 118, 22)], { kind: 'pop' }),
  ],
  extras: [],
};

export const scenes = [waterfall, garden, skyScene, moonlight, snowlands, earth];
export const getScene = (id) => scenes.find((s) => s.id === id);
