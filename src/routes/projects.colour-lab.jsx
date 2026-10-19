import { createFileRoute } from '@tanstack/react-router';
import ColourLabPage from '../features/colour-lab/ColourLabPage';

export const Route = createFileRoute('/projects/colour-lab')({
  validateSearch: (s) => ({ try: s.try === true || s.try === 'true' || s.try === 1 ? true : undefined }),
  head: () => ({ meta: [{ title: "Zoobi's Colour Lab" }] }),
  component: Page,
});

function Page() {
  const { try: tryMode } = Route.useSearch();
  const navigate = Route.useNavigate();
  return <ColourLabPage tryMode={tryMode} onTry={() => navigate({ search: { try: true } })} onExitTry={() => navigate({ search: {} })} />;
}
