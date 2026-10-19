import { createFileRoute } from '@tanstack/react-router';
import UniversePage from '../features/universe-colouring/UniversePage';

export const Route = createFileRoute('/projects/universe-colouring')({
  validateSearch: (s) => ({
    scene: typeof s.scene === 'string' ? s.scene : undefined,
    try: s.try === true || s.try === 'true' || s.try === 1 ? true : undefined,
  }),
  head: () => ({ meta: [{ title: 'Zoobi Colours the Universe' }] }),
  component: Page,
});

function Page() {
  const { scene, try: tryMode } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <UniversePage
      sceneId={scene}
      tryMode={tryMode}
      onOpenScene={(id) => navigate({ search: { scene: id } })}
      onCloseScene={() => navigate({ search: {} })}
      onTry={() => navigate({ search: { try: true, scene } })}
      onExitTry={() => navigate({ search: scene ? { scene } : {} })}
    />
  );
}
