export type Role = "admin" | "teacher" | "student" | "parent";

export interface RawRoute {
    id: string;
    basePath: string;
    roles?: Role[];
}

export interface AppRoute {
    id: string;         // full ID: e.g. admin.users
    baseId: string;     // raw ID: e.g. users
    basePath: string;   // e.g. /users
    path: string;       // full path: e.g. /admin/users
    roles?: Role[];
}
