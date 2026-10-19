/* Zoobi's five hand-drawn pages: line art + a region map + a colour plan (see tools/ for how they were baked). */
import meta1 from '../../assets/projects/drawings/puppy-in-the-meadow.json';
import lines1 from '../../assets/projects/drawings/puppy-in-the-meadow-lines.webp';
import map1 from '../../assets/projects/drawings/puppy-in-the-meadow-map.png';
import meta2 from '../../assets/projects/drawings/cosy-little-house.json';
import lines2 from '../../assets/projects/drawings/cosy-little-house-lines.webp';
import map2 from '../../assets/projects/drawings/cosy-little-house-map.png';
import meta3 from '../../assets/projects/drawings/baby-giraffe.json';
import lines3 from '../../assets/projects/drawings/baby-giraffe-lines.webp';
import map3 from '../../assets/projects/drawings/baby-giraffe-map.png';
import meta4 from '../../assets/projects/drawings/butterfly-garden.json';
import lines4 from '../../assets/projects/drawings/butterfly-garden-lines.webp';
import map4 from '../../assets/projects/drawings/butterfly-garden-map.png';
import meta5 from '../../assets/projects/drawings/bird-with-balloons.json';
import lines5 from '../../assets/projects/drawings/bird-with-balloons-lines.webp';
import map5 from '../../assets/projects/drawings/bird-with-balloons-map.png';

const make = (meta, lines, map) => ({
  kind: 'raster',
  id: meta.id,
  title: meta.title,
  blurb: meta.blurb,
  alt: meta.alt,
  paper: '#fffaf0',
  meta,
  lines,
  map,
});

export const drawings = [
  make(meta1, lines1, map1),
  make(meta2, lines2, map2),
  make(meta3, lines3, map3),
  make(meta4, lines4, map4),
  make(meta5, lines5, map5),
];
export const getDrawing = (id) => drawings.find((d) => d.id === id);
