import type { RawRoute } from "./types";

export const rawRoutes: RawRoute[] = [
    { id: "home", basePath: "/"}, // no roles = global
    { id: "profile", basePath: "/profile" },
    { id: "dashboard", basePath: "/", roles: ["admin","teacher","student","parent"] },
    { id: "users", basePath: "/users", roles: ["admin"] },
    { id: "roles", basePath: "/roles", roles: ["admin"] },
    { id: "permissions", basePath: "/permissions", roles: ["admin"] },
    { id: "settings", basePath: "/settings", roles: ["admin"] },
];
