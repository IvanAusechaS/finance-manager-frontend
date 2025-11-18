/**
 * API Client
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignupResponse {
  message: string;
  user?: {
    id: number;
    nickname: string;
    email: string;
  };
  account?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ProfileResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}

// Category Types
export interface Category {
  id: number;
  name: string;
  tipo: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  category: Category;
}

export interface CreateCategoryRequest {
  name: string;
  tipo: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  tipo?: string;
}

// Account Types
export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  money: number;
  categoryId: number;
  userId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface AccountResponse {
  account: Account;
}

export interface CreateAccountRequest {
  name: string;
  type?: string;
  balance?: number;
  money: number;
  categoryId: number;
  userId?: number;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: string;
  balance?: number;
  money?: number;
  categoryId?: number;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
  accountId: number;
  userId: number;
  account?: Account;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  color: string;
  description?: string;
  accountId?: number;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
  description?: string;
  accountId?: number;
}

// Transaction Types
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  transactionDate: string;
  isIncome: boolean;
  userId: number;
  accountId: number;
  tagId?: number;
  tag?: Tag;
  account?: Account;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  description?: string;
  amount: number;
  transactionDate: string;
  isIncome: boolean;
  accountId?: number;
  tagId?: number;
}

export interface UpdateTransactionRequest {
  description?: string;
  amount?: number;
  transactionDate?: string;
  isIncome?: boolean;
  accountId?: number;
  tagId?: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  isIncome?: boolean;
  accountId?: number;
  tagId?: number;
}

// ============================================================================
// HTTP Client Helper
// ============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          message: "Error en la solicitud",
          status: response.status,
        }));
        throw error;
      }

      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if ((error as ApiError).message) {
        throw error;
      }
      throw {
        message: "Error de conexión con el servidor",
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<SignupResponse>("/auth/signup", data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ResetPasswordResponse>("/auth/reset-password", data),

  getProfile: () => apiClient.get<ProfileResponse>("/auth/profile"),

  updateProfile: (data: { nickname?: string; email?: string }) =>
    apiClient.put<ProfileResponse>("/auth/profile", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post<{ message: string }>("/auth/change-password", data),

  deleteAccount: (data: { password: string }) =>
    apiClient.post<{ message: string }>("/auth/delete-account", data),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ============================================================================
// Category API
// ============================================================================

export const categoryApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),

  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<CategoryResponse>("/categories", data),

  update: (id: number, data: UpdateCategoryRequest) =>
    apiClient.put<CategoryResponse>(`/categories/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};

// ============================================================================
// Account API
// ============================================================================

export const accountApi = {
  getAll: (userId?: number) => {
    const endpoint = userId ? `/accounts?userId=${userId}` : "/accounts";
    return apiClient.get<Account[]>(endpoint);
  },

  getById: (id: number) => apiClient.get<Account>(`/accounts/${id}`),

  create: (data: CreateAccountRequest) =>
    apiClient.post<AccountResponse>("/accounts", data),

  update: (id: number, data: UpdateAccountRequest) =>
    apiClient.put<AccountResponse>(`/accounts/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/accounts/${id}`),
};

// ============================================================================
// Tag API
// ============================================================================

export const tagApi = {
  getAll: () => apiClient.get<Tag[]>("/tags"),

  getById: (id: number) => apiClient.get<Tag>(`/tags/${id}`),

  create: (data: CreateTagRequest) => apiClient.post<Tag>("/tags", data),

  update: (id: number, data: UpdateTagRequest) =>
    apiClient.put<Tag>(`/tags/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/tags/${id}`),
};

// ============================================================================
// Transaction API
// ============================================================================

export const transactionApi = {
  getAll: (filters?: TransactionFilters) => {
    let endpoint = "/transactions";
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }
    return apiClient.get<Transaction[]>(endpoint);
  },

  getById: (id: number) => apiClient.get<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionRequest) =>
    apiClient.post<Transaction>("/transactions", data),

  update: (id: number, data: UpdateTransactionRequest) =>
    apiClient.put<Transaction>(`/transactions/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/transactions/${id}`),
};
