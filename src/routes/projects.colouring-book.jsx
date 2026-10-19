import { createFileRoute } from '@tanstack/react-router';
import ColouringBookPage from '../features/colouring-book/ColouringBookPage';

export const Route = createFileRoute('/projects/colouring-book')({
  validateSearch: (s) => ({
    art: typeof s.art === 'string' ? s.art : undefined,
    try: s.try === true || s.try === 'true' || s.try === 1 ? true : undefined,
  }),
  head: () => ({ meta: [{ title: "Zoobi's Colouring Book" }] }),
  component: Page,
});

function Page() {
  const { art, try: tryMode } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ColouringBookPage
      artId={art}
      tryMode={tryMode}
      onOpenArt={(id) => navigate({ search: { art: id } })}
      onCloseArt={() => navigate({ search: {} })}
      onTry={() => navigate({ search: { try: true, art } })}
      onExitTry={() => navigate({ search: art ? { art } : {} })}
    />
  );
}
