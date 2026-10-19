import { Link } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';

/** The one consistent "Wanna Try?" call to action. Renders a <Link> when `to` is given, else a <button>. */
export default function WannaTryButton({ onClick, to, search, label = 'Wanna Try?', hint, className = '' }) {
  const inner = (
    <>
      <Sparkles aria-hidden="true" size={18} />
      <span>{label}</span>
    </>
  );
  const cls = `zp-try ${className}`;
  const aria = hint ? `${label} ${hint}` : label;
  if (to) {
    return (
      <Link to={to} search={search} className={cls} aria-label={aria}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={aria}>
      {inner}
    </button>
  );
}
