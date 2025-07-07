// Base types
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Enhanced user interface
export interface User {
    id: string;
    email: string;
    username?: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    imageUrl?: string;
    
    // Role and permissions
    role: UserRole;
    subrole?: string;
    permissions: string[];
    
    // Status and dates
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    
    // Personal information
    dateOfBirth?: Date;
    gender?: Gender;
    phoneNumber?: string;
    address?: Address;
    
    // Academic information (role-specific)
    academicInfo?: AcademicInfo;
    
    // Preferences
    preferences: UserPreferences;
    
    // Metadata
    metadata?: Record<string, any>;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface AcademicInfo {
    studentId?: string;
    teacherId?: string;
    grade?: string;
    class?: string;
    subjects?: string[];
    department?: string;
    hireDate?: Date;
    graduationYear?: number;
}

export interface UserPreferences {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
    notifications: NotificationPreferences;
    accessibility?: AccessibilityPreferences;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    digest: 'daily' | 'weekly' | 'monthly' | 'never';
    types: {
        grades: boolean;
        attendance: boolean;
        assignments: boolean;
        announcements: boolean;
        messages: boolean;
        events: boolean;
    };
}

export interface AccessibilityPreferences {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
}

// Request/Response types
export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    subrole?: string;
    password?: string;
    sendInvitation?: boolean;
    academicInfo?: Partial<AcademicInfo>;
    phoneNumber?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    address?: Address;
    metadata?: Record<string, any>;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    subrole?: string;
    status?: UserStatus;
    permissions?: string[];
    phoneNumber?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    address?: Address;
    academicInfo?: Partial<AcademicInfo>;
    preferences?: Partial<UserPreferences>;
    metadata?: Record<string, any>;
}

export interface UserFilters {
    role?: UserRole[];
    status?: UserStatus[];
    emailVerified?: boolean;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
    createdAfter?: Date;
    createdBefore?: Date;
    grade?: string[];
    department?: string[];
    subjects?: string[];
}

// Utility types
export interface UserListItem {
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    lastLoginAt?: Date;
    createdAt: Date;
}

export interface UserProfile extends User {
    // Additional profile-specific fields
    bio?: string;
    socialLinks?: SocialLinks;
    achievements?: Achievement[];
    badges?: Badge[];
}

export interface SocialLinks {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    iconUrl?: string;
    achievedAt: Date;
    category: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    color: string;
    earnedAt: Date;
}

// Backward compatibility
export interface UserType extends User {
    name: string; // Maps to displayName
}

// Type guards
export function isValidUserRole(role: string): role is UserRole {
    return ['admin', 'teacher', 'student', 'parent'].includes(role);
}

export function isValidUserStatus(status: string): status is UserStatus {
    return ['active', 'inactive', 'pending', 'suspended'].includes(status);
}

export function isUser(obj: any): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.firstName === 'string' &&
        typeof obj.lastName === 'string' &&
        isValidUserRole(obj.role) &&
        isValidUserStatus(obj.status)
    );
}