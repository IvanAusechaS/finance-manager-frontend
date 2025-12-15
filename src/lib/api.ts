/**
 * API Service - Centralizes all HTTP requests to the backend
 * Base URL configured via environment variable
 */

import { API_BASE_URL } from "./env";

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * interfaces for the admin
 */
export interface AdminLoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
    role: "admin" | "super_admin";
  };
}

export type UserWithRole = SignupResponse["user"] & {
  role?: { name: string; };
};

export interface UserSessionLog {
  id: number;
  userId: number;
  deviceId: string;
  userAgent: string;
  ip: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  revoke: boolean;
}

export interface LoginLogsResponse {
  logs: UserSessionLog[];
}

// Interfaz para pasar parámetros opcionales a la URL
export interface LoginLogsQuery {
  userId?: number; 
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important: Send cookies (AccessToken, RefreshToken, deviceId)
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const error = new Error("Error del servidor. Intenta nuevamente.") as Error & ApiError;
      (error as ApiError).statusCode = response.status;
      throw error;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "Error en la solicitud") as Error & ApiError;
      (error as ApiError).statusCode = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Network errors or fetch failures
    if (error instanceof TypeError) {
      const apiError = new Error(
        "No se pudo conectar al servidor. Verifica tu conexión a internet."
      ) as Error & ApiError;
      (apiError as ApiError).statusCode = 0;
      throw apiError;
    }
    throw error;
  }
}

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * POST /api/auth/signup
   * Register a new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/login
   * Authenticate user and receive session cookies
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/logout
   * Revoke current device session
   */
  logout: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  /**
   * POST /api/auth/admin/login
   * Authenticate Admin/Super Admin and receive session cookies (`adminAuthToken`)
   */
  adminLogin: async (data: LoginRequest): Promise<AdminLoginResponse> => {
    return apiRequest<AdminLoginResponse>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/recover
   * Send password recovery email
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    return apiRequest<ForgotPasswordResponse>("/api/auth/recover", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/reset/:token
   * Reset password using token from email
   */
  resetPassword: async (
    token: string,
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    return apiRequest<ResetPasswordResponse>(`/api/auth/reset/${token}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/auth/profile
   * Get authenticated user profile
   */
  getProfile: async (): Promise<{ user: SignupResponse["user"] }> => {
    return apiRequest<{ user: SignupResponse["user"] }>("/api/auth/profile", {
      method: "GET",
    });
  },

  /**
   * PUT /api/auth/profile
   * Update authenticated user profile (nickname and/or email)
   */
  updateProfile: async (data: {
    nickname?: string;
    email?: string;
  }): Promise<{ message: string; user: SignupResponse["user"] }> => {
    return apiRequest<{ message: string; user: SignupResponse["user"] }>(
      "/api/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * POST /api/auth/change-password
   * Change user password (requires current password)
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/auth/account
   * Delete user account (requires password confirmation)
   */
  deleteAccount: async (data: {
    password: string;
  }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/account", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token from cookies
   */
  refreshToken: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/refresh", {
      method: "POST",
    });
  },
};

/**
 * Admin API interfaces
 */
// Usuarios
export interface UserListItem {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  role: { name: 'user' | 'admin' | 'super_admin' };
}
export interface UserListResponse {
  users: UserListItem[];
}

// Estadísticas de Reseteo
export interface ResetStatsByUser {
  userId: number;
  resetCount: number;
}
export interface ResetStatsResponse {
  totalResets: number;
  byUser: ResetStatsByUser[];
}

// Estadísticas Generales
export interface OverviewStatsResponse {
  transactionsCount: number;
  totalUsers: number;
  adminCount: number;
  from: string; // ISO Date string
  to: string;   // ISO Date string
}

// Gestión de Administradores (Creación)
// Reutilizamos LoginRequest para el body
export interface AdminCreationResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
  };
}
/**
 * Admin API endpoints
 * Requieren la cookie `adminAuthToken`
 */
export const adminApi = {
  /**
   * GET /api/admin/logs/login
   * Obtiene el historial de sesiones (logs de login)
   * @param query - userId opcional para filtrar
   */
  getLoginLogs: async (query?: LoginLogsQuery): Promise<LoginLogsResponse> => {
    let endpoint = "/api/admin/logs/login";
    
    // Construir la cadena de consulta (query string) si existe userId
    if (query?.userId) {
      endpoint += `?userId=${query.userId}`;
    }

    return apiRequest<LoginLogsResponse>(endpoint, {
      method: "GET",
    });
  },
  // 5.2.1 Obtener todos los usuarios
  getUsers: async (): Promise<UserListResponse> => {
    return apiRequest<UserListResponse>("/api/admin/users", {
      method: "GET",
    });
  },

// 5.2.2 Eliminar (lógicamente) un usuario
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

// 5.3 Estadísticas de reseteo de contraseña
  getPasswordResetStats: async (): Promise<ResetStatsResponse> => {
    return apiRequest<ResetStatsResponse>("/api/admin/stats/password-resets", {
      method: "GET",
    });
  },

// 5.4 Estadísticas generales
  getOverviewStats: async (from: string, to: string): Promise<OverviewStatsResponse> => {
    // Las fechas deben ser pasadas como YYYY-MM-DD
    const endpoint = `/api/admin/stats/overview?from=${from}&to=${to}`;
    return apiRequest<OverviewStatsResponse>(endpoint, {
      method: "GET",
    });
  },

// 6.1 Crear un nuevo administrador (Requiere Super Admin)
// Reutiliza LoginRequest del authApi para el body
  createAdmin: async (data: LoginRequest): Promise<AdminCreationResponse> => {
    return apiRequest<AdminCreationResponse>("/api/admin/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

// 6.2 Eliminar un administrador (Requiere Super Admin)
  deleteAdmin: async (adminId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/admin/admins/${adminId}`, {
      method: "DELETE",
    });
  },
};

/**
 * Category interfaces
 */
export interface Category {
  id: number;
  tipo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  tipo: string;
}

export interface UpdateCategoryRequest {
  tipo?: string;
}

/**
 * Category API endpoints
 */
export const categoryApi = {
  /**
   * POST /api/categories
   * Create a new category
   */
  create: async (
    data: CreateCategoryRequest
  ): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>(
      "/api/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * GET /api/categories
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/categories", {
      method: "GET",
    });
  },

  /**
   * GET /api/categories/:id
   * Get category by ID
   */
  getById: async (id: number): Promise<Category> => {
    return apiRequest<Category>(`/api/categories/${id}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/categories/:id
   * Update category
   */
  update: async (
    id: number,
    data: UpdateCategoryRequest
  ): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>(
      `/api/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * DELETE /api/categories/:id
   * Delete category
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Account interfaces
 */
export interface Account {
  id: number;
  name: string | null;
  money: number;
  userId: number;
  categoryId: number;
  createdAt: string;
  category?: Category;
}

export interface CreateAccountRequest {
  name: string;
  money: number;
  categoryId: number;
  userId: number;
}

export interface UpdateAccountRequest {
  name?: string;
  money?: number;
  categoryId?: number;
}

/**
 * Account API endpoints
 */
export const accountApi = {
  /**
   * POST /api/accounts
   * Create a new account
   */
  create: async (
    data: CreateAccountRequest
  ): Promise<{ message: string; account: Account }> => {
    return apiRequest<{ message: string; account: Account }>("/api/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/accounts?userId=:userId
   * Get all accounts for a specific user
   */
  getAll: async (userId: number): Promise<Account[]> => {
    return apiRequest<Account[]>(`/api/accounts?userId=${userId}`, {
      method: "GET",
    });
  },

  /**
   * GET /api/accounts/:id
   * Get account by ID
   */
  getById: async (id: number): Promise<Account> => {
    return apiRequest<Account>(`/api/accounts/${id}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/accounts/:id
   * Update account
   */
  update: async (
    id: number,
    data: UpdateAccountRequest
  ): Promise<{ message: string; account: Account }> => {
    return apiRequest<{ message: string; account: Account }>(
      `/api/accounts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * DELETE /api/accounts/:id
   * Delete account
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/accounts/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Tag interfaces
 */
export interface Tag {
  id: number;
  name: string;
  description: string | null;
  accountId: number;
  account?: {
    id: number;
    name: string | null;
  };
  transactions?: Array<{
    id: number;
  }>;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
  accountId: number;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
}

/**
 * Tag API endpoints
 */
export const tagApi = {
  /**
   * POST /api/tags
   * Create a new tag
   */
  create: async (
    data: CreateTagRequest
  ): Promise<{ message: string; tag: Tag }> => {
    return apiRequest<{ message: string; tag: Tag }>("/api/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/tags
   * Get all tags for the authenticated user
   */
  getAll: async (): Promise<Tag[]> => {
    return apiRequest<Tag[]>("/api/tags", {
      method: "GET",
    });
  },

  /**
   * GET /api/tags/:accountId
   * Get all tags for a specific account
   */
  getByAccount: async (accountId: number): Promise<Tag[]> => {
    return apiRequest<Tag[]>(`/api/tags/${accountId}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/tags/:id
   * Update tag
   */
  update: async (
    id: number,
    data: UpdateTagRequest
  ): Promise<{ message: string; tag: Tag }> => {
    return apiRequest<{ message: string; tag: Tag }>(`/api/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/tags/:id
   * Delete tag
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/tags/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Transaction interfaces
 */
export interface Transaction {
  id: number;
  amount: number;
  isIncome: boolean;
  transactionDate: string;
  description: string | null;
  tagId: number;
  tag?: Tag;
}

export interface CreateTransactionRequest {
  amount: number;
  isIncome: boolean;
  transactionDate: string;
  description?: string;
  tagId: number;
}

export interface UpdateTransactionRequest {
  amount?: number;
  isIncome?: boolean;
  transactionDate?: string;
  description?: string;
  tagId?: number;
}

export interface TransactionFilters {
  accountId?: number;
  tagId?: number;
  isIncome?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Transaction API endpoints
 */
export const transactionApi = {
  /**
   * POST /api/transactions
   * Create a new transaction
   */
  create: async (
    data: CreateTransactionRequest
  ): Promise<{ message: string; transaction: Transaction }> => {
    return apiRequest<{ message: string; transaction: Transaction }>(
      "/api/transactions",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * GET /api/transactions
   * Get all transactions with optional filters
   */
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.accountId !== undefined)
        params.append("accountId", filters.accountId.toString());
      if (filters.tagId !== undefined)
        params.append("tagId", filters.tagId.toString());
      if (filters.isIncome !== undefined)
        params.append("isIncome", filters.isIncome.toString());
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/transactions?${queryString}`
      : "/api/transactions";

    return apiRequest<Transaction[]>(url, {
      method: "GET",
    });
  },

  /**
   * GET /api/transactions/:id
   * Get a transaction by ID
   */
  getById: async (id: number): Promise<Transaction> => {
    return apiRequest<Transaction>(`/api/transactions/${id}`, {
      method: "GET",
    });
  },

  /**
   * GET /api/transactions/date/:date
   * Get transactions by specific date
   */
  getByDate: async (date: string): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(`/api/transactions/date/${date}`, {
      method: "GET",
    });
  },

  /**
   * GET /api/transactions/type/:type/date/:date
   * Get transactions by type (income/expense) and date
   */
  getByTypeAndDate: async (
    type: "income" | "expense",
    date: string
  ): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(
      `/api/transactions/type/${type}/date/${date}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * PUT /api/transactions/:id
   * Update transaction
   */
  update: async (
    id: number,
    data: UpdateTransactionRequest
  ): Promise<{ message: string; transaction: Transaction }> => {
    return apiRequest<{ message: string; transaction: Transaction }>(
      `/api/transactions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * DELETE /api/transactions/:id
   * Delete transaction
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  },
};

export { API_BASE_URL } from "./env";