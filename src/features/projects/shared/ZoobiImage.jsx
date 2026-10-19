import easel from '../../../assets/projects/zoobi-easel.webp';
import lab from '../../../assets/projects/zoobi-lab.webp';
import cloud from '../../../assets/projects/zoobi-cloud.webp';

export const ZOOBI = {
  easel: { src: easel, alt: 'Zoobi in a beret painting at an easel with a rainbow brush' },
  lab: { src: lab, alt: 'Zoobi in a lab coat and round glasses pouring pink and blue potions together' },
  cloud: { src: cloud, alt: 'Zoobi sitting on a cloud, painting a rainbow stream with a brush' },
};

export default function ZoobiImage({ pose = 'easel', className = '', eager = false }) {
  const z = ZOOBI[pose];
  return <img className={`zp-zoobi ${className}`} src={z.src} alt={z.alt} width="900" height="714" loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" />;
}
