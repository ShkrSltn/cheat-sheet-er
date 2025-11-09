import type { CheatSheet, CheatSheetInput, CheatSheetUpdate, User, LoginCredentials, RegisterCredentials } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api'

interface AuthResponse {
  access_token: string
  user: User
}

interface ApiError {
  message: string
  statusCode: number
}

class ApiClient {
  private token: string | null = null

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth-token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth-token', token)
    } else {
      localStorage.removeItem('auth-token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json()

    if (!response.ok) {
      const error = data as ApiError
      throw new Error(error.message || 'An error occurred')
    }

    return data as T
  }

  // Auth endpoints
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        confirmPassword: credentials.confirmPassword,
      }),
    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  // Cheat Sheet endpoints
  async getCheatSheets(): Promise<CheatSheet[]> {
    return this.request<CheatSheet[]>('/cheat-sheets')
  }

  async getCheatSheet(id: string): Promise<CheatSheet> {
    return this.request<CheatSheet>(`/cheat-sheets/${id}`)
  }

  async createCheatSheet(input: CheatSheetInput): Promise<CheatSheet> {
    return this.request<CheatSheet>('/cheat-sheets', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async updateCheatSheet(id: string, updates: CheatSheetUpdate): Promise<CheatSheet> {
    return this.request<CheatSheet>(`/cheat-sheets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteCheatSheet(id: string): Promise<void> {
    return this.request<void>(`/cheat-sheets/${id}`, {
      method: 'DELETE',
    })
  }

  // Category endpoints
  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories')
  }

  async createCategory(name: string): Promise<{ name: string }> {
    return this.request<{ name: string }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  async deleteCategory(name: string, force = false): Promise<void> {
    return this.request<void>(`/categories/${encodeURIComponent(name)}?force=${force}`, {
      method: 'DELETE',
    })
  }
}

// Create singleton instance
export const api = new ApiClient()

