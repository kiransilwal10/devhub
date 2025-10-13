const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8000";

interface ApiError extends Error {
  status?: number
  data?: any
}

// Type definitions matching your backend
export interface Repository {
  id: number
  name: string
  description?: string
  is_private: boolean
  owner_id: number
  gitea_id?: number
  gitea_owner?: string
  clone_url?: string
  ssh_url?: string
  created_at: string
  updated_at?: string
}

export interface CreateRepositoryData {
  name: string
  description?: string
  is_private: boolean
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available (for future auth implementation)
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      // Handle 204 No Content (DELETE responses)
      if (response.status === 204) {
        return {} as T
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        )
        error.status = response.status
        error.data = errorData
        throw error
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return {} as T
    } catch (error) {
      if (error instanceof Error) {
        // Show toast notification for API errors
        this.showErrorToast(error.message)
        throw error
      }
      throw new Error("An unexpected error occurred")
    }
  }

  private showErrorToast(message: string) {
    // Create a simple toast notification
    const toast = document.createElement("div")
    toast.className =
      "fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
    toast.innerHTML = `
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium">Error</p>
          <p class="text-sm">${message}</p>
        </div>
      </div>
    `

    document.body.appendChild(toast)

    // Remove toast after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient()

// Repository API - Connected to FastAPI backend
export const repoApi = {
  // Get all repositories
  list: () => api.get<Repository[]>("/api/repos/"),

  // Get single repository by ID
  getById: (id: number) => api.get<Repository>(`/api/repos/${id}`),

  // Create new repository
  create: (data: CreateRepositoryData) => 
    api.post<Repository>("/api/repos/", data),

  // Delete repository
  delete: (id: number) => api.delete<void>(`/api/repos/${id}`),

  // Count total repositories (optional)
  count: () => api.get<{ total: number }>("/api/repos/count"),
}

// Auth API (for future implementation)
export const authApi = {
  login: (username: string, password: string) => 
    api.post<{ access_token: string; token_type: string }>("/api/auth/login", { 
      username, 
      password 
    }),

  register: (username: string, email: string, password: string, full_name?: string) => 
    api.post<User>("/api/auth/register", { 
      username, 
      email, 
      password,
      full_name 
    }),

  getCurrentUser: () => api.get<User>("/api/auth/me"),

  logout: () => {
    localStorage.removeItem("token")
  },
}

// Health check API
export const healthApi = {
  check: () => api.get<{ 
    status: string; 
    environment: string; 
    database: string;
    gitea?: string;
  }>("/api/health"),

  dbTest: () => api.get<{ 
    status: string; 
    message: string; 
    test_query?: string;
    tables_created?: string[];
  }>("/api/db-test"),
}

// Activity API (placeholder for future implementation)
export const activityApi = {
  list: () =>
    api.get<Array<{
      id: number
      repo_id: number
      repo_name: string
      action: string
      actor: string
      created_at: string
    }>>("/api/activities/"),

  // This is a placeholder - you'll implement this later
  listByRepo: (repoId: number) =>
    api.get<any[]>(`/api/repos/${repoId}/activities`),
}
