/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from "./routes/__root";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as ProjectsColourLabRouteImport } from "./routes/projects.colour-lab";
import { Route as ProjectsColouringBookRouteImport } from "./routes/projects.colouring-book";
import { Route as ProjectsUniverseColouringRouteImport } from "./routes/projects.universe-colouring";

const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRouteImport,
});
const ProjectsColourLabRoute = ProjectsColourLabRouteImport.update({
  id: "/projects/colour-lab",
  path: "/projects/colour-lab",
  getParentRoute: () => rootRouteImport,
});
const ProjectsColouringBookRoute = ProjectsColouringBookRouteImport.update({
  id: "/projects/colouring-book",
  path: "/projects/colouring-book",
  getParentRoute: () => rootRouteImport,
});
const ProjectsUniverseColouringRoute = ProjectsUniverseColouringRouteImport.update({
  id: "/projects/universe-colouring",
  path: "/projects/universe-colouring",
  getParentRoute: () => rootRouteImport,
});

const rootRouteChildren = {
  IndexRoute: IndexRoute,
  ProjectsColourLabRoute: ProjectsColourLabRoute,
  ProjectsColouringBookRoute: ProjectsColouringBookRoute,
  ProjectsUniverseColouringRoute: ProjectsUniverseColouringRoute,
};
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren);
