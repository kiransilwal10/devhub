const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "/api";


interface ApiError extends Error {
  status?: number
  data?: any
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

    // Add auth token if available
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
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

// Convenience functions for common API calls
export const authApi = {
  login: (email: string, password: string) => api.post<{ token: string }>("/auth/login", { email, password }),

  register: (email: string, password: string) => api.post<{ token: string }>("/auth/register", { email, password }),
}

export const repoApi = {
  list: (clientId: string) =>
    api.get<
      Array<{
        id: string
        name: string
        visibility: "public" | "private"
        clone_urls: { https: string; ssh: string }
      }>
    >(`/repos?client_id=${clientId}`),

  create: (name: string, visibility: "public" | "private", clientId: string) =>
    api.post<{ id: string; name: string; visibility: string }>("/repos", {
      name,
      visibility,
      client_id: clientId,
    }),
}

export const activityApi = {
  list: (clientId: string) =>
    api.get<
      Array<{
        id: string
        repo: string
        branch: string
        actor: string
        at: string
      }>
    >(`/activities?client_id=${clientId}`),
}
