import { useEffect, useRef, useState } from 'react';

/** Renders children only once the placeholder is near the viewport (keeps galleries light). */
export default function LazyMount({ children, className = '', rootMargin = '240px', style }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (seen || !ref.current) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return (
    <div ref={ref} className={className} style={style}>
      {seen ? children : null}
    </div>
  );
}
