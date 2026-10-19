/**
 * Zoobi's colour lab data.
 * EXPERIMENTS are Zoobi's own hand-mixed recipes (the showcase). Their results are fixed, named, and never random.
 * SHADE_LIBRARY is the named palette the visitor mixer uses to name any new blend (nearest match, deterministic).
 */
export const BASE_COLOURS = [
  { id: 'pink', name: 'Bubblegum Pink', hex: '#FF86C1' },
  { id: 'blue', name: 'Cloud Blue', hex: '#4DA3FF' },
  { id: 'yellow', name: 'Sunbeam Yellow', hex: '#FFD93D' },
  { id: 'red', name: 'Poppy Red', hex: '#EF4B4B' },
  { id: 'purple', name: 'Plum Purple', hex: '#8E5BD6' },
  { id: 'white', name: 'Pearl White', hex: '#FFFDF6' },
  { id: 'orange', name: 'Tangerine', hex: '#FF9A3C' },
  { id: 'green', name: 'Leaf Green', hex: '#4CBF6A' },
  { id: 'navy', name: 'Midnight Ink', hex: '#2B3A8C' },
];

const byId = Object.fromEntries(BASE_COLOURS.map((c) => [c.id, c]));
const src = (id) => ({ name: byId[id].name, hex: byId[id].hex, id });

export const EXPERIMENTS = [
  { id: 'dreamberry', a: src('pink'), b: src('blue'), result: { name: 'Dreamberry', hex: '#9670C7', line: 'Born when pink meets blue.' } },
  { id: 'meadow-glow', a: src('yellow'), b: src('blue'), result: { name: 'Meadow Glow', hex: '#78C466', line: 'Sunshine leaning on a clear sky.' } },
  { id: 'ember-marigold', a: src('red'), b: src('yellow'), result: { name: 'Ember Marigold', hex: '#F58B2A', line: 'The warm middle of a campfire.' } },
  { id: 'skybreeze', a: src('blue'), b: src('white'), result: { name: 'Skybreeze', hex: '#A3CFFF', line: 'Blue, lightened by a passing cloud.' } },
  { id: 'orchid-bloom', a: src('purple'), b: src('pink'), result: { name: 'Orchid Bloom', hex: '#C46BC9', line: 'A flower that only opens at dusk.' } },
  { id: 'sunset-peach', a: src('orange'), b: src('white'), result: { name: 'Sunset Peach', hex: '#FFC9A0', line: 'The last warm minute of daylight.' } },
  { id: 'stardust-teal', a: src('blue'), b: src('green'), result: { name: 'Stardust Teal', hex: '#35B6AE', line: 'Rain-washed leaves under a night sky.' } },
  { id: 'twilight-blue', a: src('purple'), b: src('blue'), result: { name: 'Twilight Blue', hex: '#5A6CD8', line: 'The hour when the first star wakes.' } },
  { id: 'moonlit-lilac', a: src('purple'), b: src('white'), result: { name: 'Moonlit Lilac', hex: '#C9B3EE', line: 'Violet, softened by moonlight.' } },
];

/** Extra named shades so every mixed colour gets a stable, charming name. */
export const SHADE_LIBRARY = [
  ...EXPERIMENTS.map((e) => ({ name: e.result.name, hex: e.result.hex })),
  { name: 'Rosewater', hex: '#F7B2CF' },
  { name: 'Candy Floss', hex: '#FFA8D6' },
  { name: 'Berry Jam', hex: '#B03A74' },
  { name: 'Poppy Fields', hex: '#E5484D' },
  { name: 'Apricot Glow', hex: '#FFB066' },
  { name: 'Honeycomb', hex: '#F2B52E' },
  { name: 'Buttercup', hex: '#FFE680' },
  { name: 'Fern Whisper', hex: '#8BCB8B' },
  { name: 'Pine Shadow', hex: '#2F7D5B' },
  { name: 'Lagoon Dream', hex: '#3FC1D6' },
  { name: 'Deep Tide', hex: '#1F5FB8' },
  { name: 'Midnight Ink', hex: '#2B3A8C' },
  { name: 'Velvet Plum', hex: '#6A3FA8' },
  { name: 'Wisteria', hex: '#A98BE0' },
  { name: 'Cocoa Mist', hex: '#9C7355' },
  { name: 'Moth Wing', hex: '#B8A9A0' },
  { name: 'Pearl Mist', hex: '#EDE7F5' },
  { name: 'Storm Cloud', hex: '#7D86A8' },
  { name: 'Moss Pond', hex: '#6E9F55' },
  { name: 'Marmalade', hex: '#E67E22' },
];

export const getExperiment = (id) => EXPERIMENTS.find((e) => e.id === id);
