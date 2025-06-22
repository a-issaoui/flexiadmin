import type { AppRoute } from "./types";
import { rawRoutes } from "./config";

export const appRoutes: readonly AppRoute[] = rawRoutes.flatMap(({ id, basePath, roles, ...rest }) => {
    // Helper to normalize path (remove trailing slash unless it's just '/')
    const normalizePath = (path: string) =>
        path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

    if (roles?.length) {
        return roles.map(role => {
            const fullPath = `/${role}${basePath}`;
            return {
                id: `${role}.${id}`,
                baseId: id,
                basePath,
                path: normalizePath(fullPath),
                titleKey: `routes.${role}.${id}.title`,
                roles: [role],
                ...rest,
            };
        });
    } else {
        return [{
            id,
            baseId: id,
            basePath,
            path: normalizePath(basePath),
            titleKey: `routes.${id}.title`,
            ...rest,
        }];
    }
});


// Create a Map for O(1) lookups
export const routeMap = new Map(appRoutes.map(route => [route.id, route]));
export const pathMap = new Map(appRoutes.map(route => [route.path, route]));
