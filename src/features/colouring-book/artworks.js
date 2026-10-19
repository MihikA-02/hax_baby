import {
  C, E, P, RC, G, L, at, mirror, place, rng, star, sparkle, cloud, land, hill, leaf, stem, petals, tulip, mushroom, butterfly, reg,
} from '../projects/paint/art-helpers';

/**
 * Zoobi's Colouring Book — six original drawings authored as data.
 * Each region is an independently colourable shape group. `at` / `dur` (ms) choreograph the brush reveal.
 * Regions are listed back-to-front (z-order); their `at` values decide the order Zoobi colours them in.
 */
const BASE = { viewBox: '0 0 800 600', paper: '#fffaf0', ink: '#3b2a40', inkDone: 1, lead: 1500 };

/* 1 ─ Butterfly Dreams */
const big = butterfly(400, 300, 1.35, -6);
const bfB = butterfly(165, 175, 0.62, -24);
const bfC = butterfly(640, 440, 0.72, 20);
const flowerSpots = [
  [140, 470, 46, 'a'],
  [255, 520, 34, 'b'],
  [560, 505, 42, 'a'],
  [690, 330, 30, 'b'],
  [95, 330, 28, 'c'],
];
const butterflyDreams = {
  ...BASE,
  id: 'butterfly-dreams',
  title: 'Butterfly Dreams',
  blurb: 'Butterflies, flowers and leaves drifting through a soft morning.',
  alt: 'A line drawing of three butterflies above flowers and leaves',
  gradients: {
    morning: { stops: [[0, '#cfeeff'], [1, '#fff0d8']] },
    wingA: { stops: [[0, '#ff8fc7'], [1, '#b388eb']] },
    wingB: { stops: [[0, '#ffd45e'], [1, '#ff9b54']] },
  },
  regions: [
    reg('sky', 'g:morning', 0, 1300, [RC(28, 28, 744, 544, 30)]),
    reg('leaves', '#78c37b', 1100, 1400, [
      leaf(70, 590, 150, 34, -62), leaf(120, 590, 140, 30, -38), leaf(240, 590, 130, 28, -80), leaf(330, 590, 120, 26, -60),
      leaf(560, 590, 150, 32, -112), leaf(640, 590, 140, 30, -132), leaf(730, 590, 130, 28, -100), leaf(470, 590, 100, 24, -95),
    ]),
    reg('stems', '#4fa36a', 1900, 900, flowerSpots.map(([x, y]) => stem(x + (x < 400 ? 20 : -20), 592, x, (y + 592) / 2, x, y + 14, 9))),
    reg('petalsPink', '#ff8fbf', 2500, 1100, flowerSpots.filter((f) => f[3] === 'a').flatMap(([x, y, r]) => petals(x, y, r, 6, r * 0.3))),
    reg('petalsViolet', '#b794f4', 2800, 1000, flowerSpots.filter((f) => f[3] === 'b').flatMap(([x, y, r]) => petals(x, y, r, 5, r * 0.32, 18))),
    reg('petalsSun', '#ffd45e', 3000, 900, flowerSpots.filter((f) => f[3] === 'c').flatMap(([x, y, r]) => petals(x, y, r, 8, r * 0.22))),
    reg('centres', '#ff9b3d', 3500, 600, flowerSpots.map(([x, y, r]) => C(x, y, r * 0.24)), { kind: 'pop' }),
    reg('wingsUpper', 'g:wingA', 3700, 1500, [big.upper, bfB.upper, bfC.upper]),
    reg('wingsLower', 'g:wingB', 4700, 1300, [big.lower, bfB.lower, bfC.lower]),
    reg('bodies', '#5a3a6e', 5700, 700, [big.body, bfB.body, bfC.body], { kind: 'pop' }),
    reg('spots', '#fffdf4', 6100, 800, [big.spots, bfB.spots, bfC.spots], { kind: 'pop' }),
    reg('feelers', 'none', 6300, 100, [big.feelers, bfB.feelers, bfC.feelers].flat()),
    reg('twinkles', '#ffe27a', 6600, 800, [sparkle(130, 90, 18), sparkle(690, 110, 22), sparkle(560, 215, 14), sparkle(250, 300, 13), sparkle(735, 250, 12)], { kind: 'pop' }),
  ],
};

/* 2 ─ Zoobi's Little Home */
const homeFlowers = [[160, 535, 22, '#ff8fbf'], [230, 555, 18, '#ffd45e'], [585, 540, 22, '#b794f4'], [655, 560, 18, '#ff9b54'], [705, 525, 20, '#ff8fbf']];
const littleHome = {
  ...BASE,
  id: 'zoobis-little-home',
  title: "Zoobi's Little Home",
  blurb: 'A cosy toadstool-roofed cottage, a winding path and a garden full of friends.',
  lead: 1400,
  alt: 'A line drawing of a cosy fantasy cottage with a round door, a tree, a fence and a garden path',
  gradients: {
    sky: { stops: [[0, '#bfe6ff'], [1, '#fff4dc']] },
    roof: { stops: [[0, '#ff7fae'], [1, '#e2557f']] },
  },
  regions: [
    reg('sky', 'g:sky', 0, 1200, [RC(28, 28, 744, 544, 30)]),
    reg('sun', '#ffd45e', 800, 700, [C(660, 120, 42)], { kind: 'pop' }),
    reg('rays', 'none', 1000, 100, [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4; return L(`M${660 + Math.cos(a) * 56},${120 + Math.sin(a) * 56} L${660 + Math.cos(a) * 76},${120 + Math.sin(a) * 76}`); })),
    reg('clouds', '#ffffff', 1000, 900, [cloud(190, 130, 170), cloud(470, 85, 120)]),
    reg('hills', '#9ad67f', 1700, 1200, [land([[28, 400], [200, 360], [400, 395], [600, 350], [772, 385]], 572)]),
    reg('tree', '#58a863', 2600, 1000, [C(90, 330, 70), C(150, 300, 55)]),
    reg('trunk', '#a87a55', 2400, 500, [RC(76, 340, 26, 90, 6)]),
    reg('lawn', '#7bc86c', 3200, 1000, [land([[28, 470], [250, 450], [520, 470], [772, 440]], 572)]),
    reg('path', '#f5deb3', 3900, 900, [P('M360,572 C340,520 470,500 420,455 C395,435 395,425 400,420 L440,420 C455,440 480,460 520,480 C560,505 520,545 600,572 Z')]),
    reg('walls', '#fff0d0', 4300, 900, [RC(280, 270, 240, 170, 14)]),
    reg('chimney', '#c97a6a', 4600, 400, [RC(458, 98, 34, 90, 4)]),
    reg('roof', 'g:roof', 4800, 1000, [P('M250,285 C250,185 330,130 400,130 C470,130 550,185 550,285 C470,262 330,262 250,285 Z')]),
    reg('roofDots', '#fffdf4', 5500, 500, [C(340, 205, 13), C(405, 175, 15), C(465, 215, 12), C(375, 245, 9)], { kind: 'pop' }),
    reg('door', '#8c63c9', 5200, 500, [P('M370,440 L370,365 C370,325 430,325 430,365 L430,440 Z')]),
    reg('windows', '#ffe9a8', 5600, 500, [C(325, 345, 24), C(475, 345, 24)], { kind: 'pop' }),
    reg('frames', 'none', 5700, 100, [L('M325,321 L325,369'), L('M301,345 L349,345'), L('M475,321 L475,369'), L('M451,345 L499,345'), L('M390,385 L394,385')]),
    reg('smoke', '#f1ecf9', 6000, 700, [cloud(480, 135, 64), cloud(505, 95, 50)]),
    reg('fence', '#fff6e6', 5000, 1100, [0, 1, 2, 3, 4].flatMap((i) => [G([[560 + i * 40, 560], [560 + i * 40, 495], [572 + i * 40, 480], [584 + i * 40, 495], [584 + i * 40, 560]])]), { }),
    reg('flowers', '#ff8fbf', 6000, 1000, homeFlowers.flatMap(([x, y, r]) => petals(x, y, r, 5, r * 0.34))),
    reg('flowerCentres', '#ffd45e', 6700, 500, homeFlowers.map(([x, y, r]) => C(x, y, r * 0.3)), { kind: 'pop' }),
    reg('twinkles', '#ffe27a', 7000, 700, [sparkle(120, 90, 16), sparkle(560, 70, 12), sparkle(735, 230, 14)], { kind: 'pop' }),
  ],
};

/* 3 ─ Dreamy Night */
const rnd3 = rng(33);
const nightStars = Array.from({ length: 34 }, () => [60 + rnd3() * 680, 50 + rnd3() * 250, 8 + rnd3() * 9]).filter(([x, y]) => Math.hypot(x - 480, y - 182) > 135);
const dreamyNight = {
  ...BASE,
  id: 'dreamy-night',
  title: 'Dreamy Night',
  blurb: 'A crescent moon, sleepy clouds and a sky full of tiny wishes.',
  lead: 1300,
  alt: 'A line drawing of a crescent moon, stars, clouds and mountains',
  gradients: {
    night: { stops: [[0, '#2b2a6e'], [1, '#7a4fb8']] },
    moon: { stops: [[0, '#fff6c2'], [1, '#ffd66b']] },
  },
  regions: [
    reg('sky', 'g:night', 0, 1500, [RC(28, 28, 744, 544, 30)]),
    reg('stars', '#ffe27a', 3600, 1500, nightStars.map(([x, y, r]) => star(x, y, r)), { kind: 'pop', stagger: 70 }),
    reg('moon', 'g:moon', 1500, 1000, [P('M520,90 A92,92 0 0 0 520,274 A128,128 0 0 1 520,90 Z')]),
    reg('craters', '#f4d56a', 2400, 400, [C(470, 150, 9), C(455, 210, 6)], { kind: 'pop' }),
    reg('clouds', '#c9b8f0', 2500, 1100, [cloud(170, 280, 230), cloud(640, 330, 210), cloud(380, 215, 120)]),
    reg('farMountains', '#6a5cc4', 3000, 1100, [land([[28, 430], [140, 330], [250, 410], [380, 300], [520, 420], [650, 340], [772, 420]], 572)]),
    reg('nearMountains', '#4b3f9e', 3700, 1100, [land([[28, 480], [180, 400], [300, 470], [450, 390], [600, 470], [772, 410]], 572)]),
    reg('snowCaps', '#e9e4ff', 4500, 700, [G([[362, 322], [380, 300], [398, 322], [385, 316], [372, 326]]), G([[132, 350], [140, 330], [160, 356], [148, 348]])]),
    reg('ground', '#2f2a6b', 4400, 900, [land([[28, 520], [250, 500], [520, 520], [772, 495]], 572)]),
    reg('cottage', '#9b7ad8', 5100, 700, [RC(330, 450, 100, 62, 6), G([[320, 455], [380, 405], [440, 455]])]),
    reg('window', '#ffd66b', 5600, 500, [RC(365, 470, 28, 28, 4)], { kind: 'pop' }),
    reg('fireflies', '#fff08a', 5900, 800, [C(210, 470, 6), C(560, 455, 6), C(640, 500, 5), C(120, 490, 5), C(470, 430, 5)], { kind: 'pop', stagger: 120 }),
  ],
};

/* 4 ─ The Flower Parade */
const parade = [
  { x: 110, y: 250, r: 62, n: 7, c: '#ff8fbf', mid: '#ffd45e' },
  { x: 260, y: 330, r: 50, n: 6, c: '#b794f4', mid: '#fff0a8' },
  { x: 410, y: 215, r: 72, n: 9, c: '#ffd45e', mid: '#9a5a3a' },
  { x: 560, y: 320, r: 52, n: 5, c: '#ff9b54', mid: '#ffe9a8' },
  { x: 700, y: 245, r: 60, n: 8, c: '#7fd0f5', mid: '#ffd45e' },
];
const tulips = [[185, 430, 1.2, '#ff6f91'], [335, 455, 1.0, '#b794f4'], [480, 440, 1.3, '#ff8fbf'], [625, 460, 1.0, '#ffb84a']];
const flowerParade = {
  ...BASE,
  id: 'the-flower-parade',
  title: 'The Flower Parade',
  blurb: 'Every flower marching proudly in its own shape and size.',
  lead: 1400,
  alt: 'A line drawing of five large daisies and four tulips in a row',
  gradients: { air: { stops: [[0, '#fff0f6'], [1, '#e8f6ff']] } },
  regions: [
    reg('air', 'g:air', 0, 1100, [RC(28, 28, 744, 544, 30)]),
    reg('grass', '#8fd27a', 800, 1300, [land([[28, 520], [200, 505], [400, 525], [600, 500], [772, 515]], 572)]),
    reg('stems', '#4fa36a', 1800, 1200, [...parade.map((p) => stem(p.x, 530, p.x + (p.x < 400 ? -18 : 18), (p.y + 530) / 2, p.x, p.y + p.r * 0.3, 10)), ...tulips.map(([x, y]) => stem(x, 535, x + 8, (y + 535) / 2, x, y, 9))]),
    reg('leaves', '#69be72', 2500, 1100, parade.flatMap((p) => [leaf(p.x, 480, 70, 17, p.x < 400 ? -150 : -30), leaf(p.x, 455, 60, 15, p.x < 400 ? -30 : -150)])),
    ...parade.map((p, i) => reg(`daisy${i}`, p.c, 3300 + i * 450, 900, petals(p.x, p.y, p.r, p.n, p.r * 0.27, i * 10))),
    ...parade.map((p, i) => reg(`mid${i}`, p.mid, 5300 + i * 120, 400, [C(p.x, p.y, p.r * 0.26)], { kind: 'pop' })),
    ...tulips.map(([x, y, s, c], i) => reg(`tulip${i}`, c, 5700 + i * 350, 700, [tulip(x, y, s)])),
    reg('butter', '#ffd45e', 7200, 700, [sparkle(110, 130, 16), sparkle(330, 95, 14), sparkle(555, 80, 18), sparkle(735, 120, 14)], { kind: 'pop' }),
  ],
};

/* 5 ─ Zoobi the Artist — a flat, gentle portrait of Zoobi beside an easel */
const zoobiArtist = {
  ...BASE,
  id: 'zoobi-the-artist',
  title: 'Zoobi the Artist',
  blurb: 'Zoobi in beret and scarf, brush raised, mid-masterpiece.',
  lead: 1600,
  alt: 'A line drawing of Zoobi holding a paintbrush beside an easel',
  gradients: {
    studio: { stops: [[0, '#fff3e0'], [1, '#f5e1ff']] },
    ears: { stops: [[0, '#ffb3d9'], [0.5, '#ffe58a'], [1, '#8fc8ff']] },
    swirl: { stops: [[0, '#ff7fc4'], [0.5, '#ffd45e'], [1, '#6ec6ff']] },
  },
  regions: [
    reg('studio', 'g:studio', 0, 1200, [RC(28, 28, 744, 544, 30)]),
    reg('floor', '#e9c9a0', 900, 800, [land([[28, 500], [400, 485], [772, 500]], 572)]),
    reg('easelWood', '#b8844f', 1700, 1000, [G([[110, 560], [180, 130], [200, 130], [150, 560]]), G([[330, 560], [262, 130], [242, 130], [290, 560]]), G([[215, 140], [227, 140], [227, 560], [215, 560]])]),
    reg('canvasFrame', '#fff6e6', 2600, 600, [RC(120, 150, 240, 230, 6)]),
    reg('paint', 'g:swirl', 3000, 1300, [P('M150,350 C190,250 220,330 250,250 C275,190 310,280 335,200 L335,360 L150,360 Z')]),
    reg('paintDots', '#fffdf4', 4200, 500, [C(180, 200, 9), C(300, 175, 7), C(235, 215, 6)], { kind: 'pop' }),
    reg('earsBack', 'g:ears', 3400, 1300, [E(445, 330, 58, 185, 14), E(675, 330, 58, 185, -14)]),
    reg('body', '#fff0dc', 4200, 900, [E(560, 470, 108, 98)]),
    reg('feet', '#c9a6f0', 4700, 400, [E(500, 565, 34, 16), E(620, 565, 34, 16)]),
    reg('scarf', 'g:swirl', 4900, 700, [P('M470,408 C520,445 600,445 650,408 L660,440 C600,480 520,480 460,440 Z'), P('M590,445 L640,445 L630,520 L596,505 Z')]),
    reg('head', '#fff3e2', 5100, 900, [E(560, 300, 126, 112)]),
    reg('cheeks', '#ffb3c6', 5800, 400, [E(480, 330, 20, 12), E(640, 330, 20, 12)], { kind: 'pop' }),
    reg('eyes', '#4a3a8c', 5600, 600, [C(510, 292, 26), C(610, 292, 26)], { kind: 'pop' }),
    reg('glints', '#fffdf4', 6100, 400, [C(520, 282, 9), C(620, 282, 9), C(502, 302, 4), C(602, 302, 4)], { kind: 'pop' }),
    reg('mouth', '#ff7a93', 6100, 400, [P('M545,335 Q560,360 575,335 Z')], { kind: 'pop' }),
    reg('beret', '#e86a9a', 6300, 800, [E(572, 205, 100, 40, -8), C(630, 170, 10)]),
    reg('antennae', 'none', 6400, 100, [L('M520,196 C490,120 540,90 560,130'), L('M600,190 C630,100 690,120 665,165')]),
    reg('arm', '#fff0dc', 6900, 500, [E(440, 398, 52, 19, -38)]),
    reg('brush', '#8a5a36', 7300, 500, [G([[385, 372], [335, 250], [345, 246], [398, 366]])]),
    reg('brushTip', '#ff7fc4', 7600, 400, [P('M334,252 L322,214 C336,206 352,212 346,248 Z')], { kind: 'pop' }),
    reg('hand', '#fff0dc', 7500, 300, [C(396, 362, 21)], { kind: 'pop' }),
    reg('stars', '#ffe27a', 7800, 700, [sparkle(150, 100, 20), sparkle(720, 110, 16), sparkle(740, 460, 14), sparkle(70, 440, 14)], { kind: 'pop' }),
  ],
};

/* 6 ─ The Magical Garden */
const m1 = mushroom(190, 500, 1.2);
const m2 = mushroom(620, 515, 0.9);
const m3 = mushroom(430, 535, 0.65);
const bfG = butterfly(520, 175, 0.55, 14);
const bfH = butterfly(250, 215, 0.45, -18);
const magicalGarden = {
  ...BASE,
  id: 'the-magical-garden',
  title: 'The Magical Garden',
  blurb: 'Mushrooms, ferns and fireflies keeping a secret garden alive.',
  lead: 1400,
  alt: 'A line drawing of mushrooms, ferns, flowers and butterflies in a garden',
  gradients: { glade: { stops: [[0, '#d7f5e8'], [1, '#fff3d6']] } },
  regions: [
    reg('glade', 'g:glade', 0, 1200, [RC(28, 28, 744, 544, 30)]),
    reg('moss', '#8fd27a', 900, 1200, [land([[28, 470], [200, 455], [420, 485], [620, 460], [772, 475]], 572)]),
    reg('ferns', '#4fae78', 1900, 1500, [leaf(80, 560, 170, 26, -75), leaf(80, 560, 150, 24, -45), leaf(80, 560, 140, 22, -105), leaf(730, 560, 170, 26, -105), leaf(730, 560, 150, 24, -135), leaf(730, 560, 140, 22, -75), leaf(330, 575, 110, 20, -80), leaf(330, 575, 100, 18, -110)]),
    reg('stems', '#58b06c', 3000, 800, [stem(310, 520, 300, 400, 300, 330, 8), stem(520, 530, 540, 430, 545, 360, 8)]),
    reg('bloomA', '#ff8fbf', 3600, 900, petals(300, 320, 38, 6, 12)),
    reg('bloomB', '#b794f4', 3900, 900, petals(545, 350, 34, 5, 12, 20)),
    reg('bloomCentres', '#ffd45e', 4400, 500, [C(300, 320, 9), C(545, 350, 8)], { kind: 'pop' }),
    reg('capsA', '#ff6f7a', 4500, 900, [m1.cap, m3.cap]),
    reg('capsB', '#9a7ae0', 4900, 800, [m2.cap]),
    reg('stalks', '#fff1d9', 5300, 700, [m1.stalk, m2.stalk, m3.stalk]),
    reg('capDots', '#fffdf4', 5800, 600, [m1.dots, m2.dots, m3.dots], { kind: 'pop' }),
    reg('wings', '#7fd0f5', 6000, 1200, [bfG.upper, bfG.lower, bfH.upper, bfH.lower]),
    reg('bfBody', '#5a3a6e', 6900, 400, [bfG.body, bfH.body], { kind: 'pop' }),
    reg('bfFeelers', 'none', 7000, 100, [bfG.feelers, bfH.feelers].flat()),
    reg('fireflies', '#ffe27a', 7200, 900, [C(150, 330, 7), C(660, 300, 7), C(420, 260, 6), C(90, 230, 6), C(730, 420, 6), C(390, 400, 6)], { kind: 'pop', stagger: 110 }),
  ],
};

export const artworks = [butterflyDreams, littleHome, dreamyNight, flowerParade, zoobiArtist, magicalGarden];
export const getArtwork = (id) => artworks.find((a) => a.id === id);
