// helpers.ts
import { appRoutes, routeMap, pathMap } from "./expanded";
import type { AppRoute, Role } from "./types";

export const getRouteById = (id: string): AppRoute | undefined =>
    routeMap.get(id);

export const getRouteByPath = (path: string): AppRoute | undefined =>
    pathMap.get(path);

export const getRoutesByRole = (role: Role): AppRoute[] =>
    appRoutes.filter((r) => !r.roles || r.roles.includes(role));

export const getGlobalRoutes = (): AppRoute[] =>
    appRoutes.filter((r) => !r.roles);

export const getRoutesByBaseId = (baseId: string): AppRoute[] =>
    appRoutes.filter((r) => r.baseId === baseId);

export const getRouteByIdFromList = (list: AppRoute[], id: string): AppRoute | undefined =>
    list.find((r) => r.id === id);

export function gethrefById(id: string, role: Role = 'admin'): string {
    // First try with role prefix
    let route = getRouteById(`${role}.${id}`);

    // If not found, try without role (global routes)
    if (!route) {
        route = getRouteById(id);
    }

    if (!route) {
        throw new Error(`No route found for id "${id}" with role "${role}"`);
    }

    return route.path; // Return full path, not basePath
}
