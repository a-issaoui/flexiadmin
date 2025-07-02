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

/**
 * Get the base route ID without the role prefix
 * Examples:
 * - "admin.dashboard" -> "dashboard"
 * - "teacher.users" -> "users"
 * - "home" -> "home" (no change for global routes)
 */
export const getBaseRouteId = (routeId: string): string => {
    // If the route contains a dot, split and take the last part
    const parts = routeId.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : routeId;
};

/**
 * Get the base route ID from a path
 * This combines getRouteByPath and getBaseRouteId
 */
export const getBaseRouteIdByPath = (path: string): string | undefined => {
    const route = getRouteByPath(path);
    return route ? getBaseRouteId(route.id) : undefined;
};

/**
 * Get the role from a route ID
 * Examples:
 * - "admin.dashboard" -> "admin"
 * - "teacher.users" -> "teacher"
 * - "home" -> undefined (global route)
 */
export const getRoleFromRouteId = (routeId: string): Role | undefined => {
    const parts = routeId.split('.');
    return parts.length > 1 ? parts[0] as Role : undefined;
};

/**
 * Check if a route ID is a global route (no role prefix)
 */
export const isGlobalRoute = (routeId: string): boolean => {
    return !routeId.includes('.');
};

/**
 * Get route information with separated base ID and role
 */
export const parseRouteId = (routeId: string): { baseId: string; role?: Role } => {
    const baseId = getBaseRouteId(routeId);
    const role = getRoleFromRouteId(routeId);
    return { baseId, role };
};