import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import '../projects.css';
import { HOME_PROJECTS_HASH } from './config';

/** Shared shell for the three project screens: back link, title, intro and a parchment stage. */
export default function ProjectLayout({ title, intro, theme = 'book', hero, cta, compact = false, children }) {
  return (
    <div className={`zp-page zp-theme-${theme}${compact ? ' is-compact' : ''}`}>
      <div className="zp-page-inner">
        <nav className="zp-topbar" aria-label="Project navigation">
          <Link to="/" hash={HOME_PROJECTS_HASH} className="zp-back">
            <ArrowLeft aria-hidden="true" size={18} />
            <span>Back to projects</span>
          </Link>
        </nav>
        <header className="zp-header">
          <div className="zp-header-text">
            <h1 className="zp-title">{title}</h1>
            {!compact && <p className="zp-intro">{intro}</p>}
            {!compact && cta ? <div className="zp-header-cta">{cta}</div> : null}
          </div>
          {!compact && hero ? <div className="zp-header-hero">{hero}</div> : null}
        </header>
        <main className="zp-main">{children}</main>
      </div>
    </div>
  );
}
