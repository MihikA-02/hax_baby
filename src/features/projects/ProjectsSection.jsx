import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import './projects.css';
import WannaTryButton from './shared/WannaTryButton';
import { PROJECT_PATHS } from './shared/config';
import { BookPreview, LabPreview, UniversePreview } from './CardPreviews';

const PROJECTS = [
  {
    id: 'book',
    name: "Zoobi's Colouring Book",
    blurb: 'Every outline holds a little bit of magic. Watch Zoobi transform simple drawings into colourful masterpieces.',
    to: PROJECT_PATHS.book,
    Preview: BookPreview,
  },
  {
    id: 'lab',
    name: "Zoobi's Colour Lab",
    blurb: 'Two colours meet, imagination takes over, and an entirely new shade is born.',
    to: PROJECT_PATHS.lab,
    Preview: LabPreview,
  },
  {
    id: 'universe',
    name: 'Zoobi Colours the Universe',
    blurb: 'From cascading waterfalls to distant galaxies, Zoobi paints entire worlds into life.',
    to: PROJECT_PATHS.universe,
    Preview: UniversePreview,
  },
];

function useEnter() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}

/** Drop-in replacement for the homepage Projects() component. */
export function Projects() {
  const [listRef, entered] = useEnter();
  return (
    <section id="projects" className="zp-projects" aria-labelledby="zp-projects-title">
      <div className="zp-projects-inner">
        <header className="zp-projects-head">
          <h2 id="zp-projects-title" className="zp-projects-title">
            Zoobi&apos;s Creative Universe
          </h2>
          <p className="zp-projects-sub">Three little projects. One endless imagination.</p>
        </header>
        <ul ref={listRef} className={`zp-cards${entered ? ' is-in' : ''}`}>
          {PROJECTS.map(({ id, name, blurb, to, Preview }, i) => (
            <li key={id} className="zp-card" data-project={id} style={{ '--n': i }}>
              <Link to={to} className="zp-card-media" tabIndex={-1} aria-hidden="true">
                <Preview />
              </Link>
              <div className="zp-card-body">
                <h3 className="zp-card-title">
                  <Link to={to} className="zp-card-link">
                    {name}
                  </Link>
                </h3>
                <p className="zp-card-text">{blurb}</p>
                <div className="zp-card-actions">
                  <WannaTryButton to={to} search={{ try: true }} hint={`in ${name}`} />
                  <Link to={to} className="zp-card-explore">
                    Explore the showcase
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Projects;
