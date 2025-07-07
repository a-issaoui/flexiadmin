// src/lib/api/services/user.service.ts

import { apiClient, ApiResponse } from '../client';
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '@/types/user.types';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: UserFilters;
}

class UserService {
  private readonly basePath = '/users';

  // Get paginated list of users
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    return apiClient.get<PaginatedResponse<User>>(endpoint);
  }

  // Get single user by ID
  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.basePath}/${id}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(this.basePath, userData);
  }

  // Update existing user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.basePath}/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Bulk operations
  async bulkDeleteUsers(ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
    return apiClient.post<{ deleted: number }>(`${this.basePath}/bulk-delete`, { ids });
  }

  async bulkUpdateUsers(
    ids: string[], 
    updates: Partial<UpdateUserRequest>
  ): Promise<ApiResponse<{ updated: number }>> {
    return apiClient.post<{ updated: number }>(`${this.basePath}/bulk-update`, { ids, updates });
  }

  // User status operations
  async activateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`${this.basePath}/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`${this.basePath}/${id}/deactivate`);
  }

  async resetUserPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return apiClient.post<{ temporaryPassword: string }>(`${this.basePath}/${id}/reset-password`);
  }

  // Search users
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}`);
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    recentRegistrations: number;
  }>> {
    return apiClient.get<any>(`${this.basePath}/stats`);
  }

  // Export users
  async exportUsers(params: UserListParams = {}): Promise<ApiResponse<{ downloadUrl: string }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${this.basePath}/export?${queryString}` : `${this.basePath}/export`;
    
    return apiClient.get<{ downloadUrl: string }>(endpoint);
  }

  // Import users
  async importUsers(file: File): Promise<ApiResponse<{
    imported: number;
    failed: number;
    errors: string[];
  }>> {
    return apiClient.upload<any>(`${this.basePath}/import`, file);
  }
}

export const userService = new UserService();