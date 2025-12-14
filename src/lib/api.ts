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
   * POST /api/category
   * Create a new category
   */
  create: async (
    data: CreateCategoryRequest
  ): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>(
      "/api/category",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * GET /api/category
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/category", {
      method: "GET",
    });
  },

  /**
   * GET /api/category/:id
   * Get category by ID
   */
  getById: async (id: number): Promise<Category> => {
    return apiRequest<Category>(`/api/category/${id}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/category/:id
   * Update category
   */
  update: async (
    id: number,
    data: UpdateCategoryRequest
  ): Promise<{ message: string; category: Category }> => {
    return apiRequest<{ message: string; category: Category }>(
      `/api/category/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * DELETE /api/category/:id
   * Delete category
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/category/${id}`, {
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
   * POST /api/account
   * Create a new account
   */
  create: async (
    data: CreateAccountRequest
  ): Promise<{ message: string; account: Account }> => {
    return apiRequest<{ message: string; account: Account }>("/api/account", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/account/:userId
   * Get all accounts for a specific user
   */
  getAll: async (userId: number): Promise<Account[]> => {
    return apiRequest<Account[]>(`/api/account/${userId}`, {
      method: "GET",
    });
  },

  /**
   * GET /api/account/:id
   * Get account by ID
   */
  getById: async (id: number): Promise<Account> => {
    return apiRequest<Account>(`/api/account/${id}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/account/:id
   * Update account
   */
  update: async (
    id: number,
    data: UpdateAccountRequest
  ): Promise<{ message: string; account: Account }> => {
    return apiRequest<{ message: string; account: Account }>(
      `/api/account/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * DELETE /api/account/:id
   * Delete account
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/account/${id}`, {
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
   * POST /api/tag
   * Create a new tag
   */
  create: async (
    data: CreateTagRequest
  ): Promise<{ message: string; tag: Tag }> => {
    return apiRequest<{ message: string; tag: Tag }>("/api/tag", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/tag
   * Get all tags for the authenticated user
   */
  getAll: async (): Promise<Tag[]> => {
    return apiRequest<Tag[]>("/api/tag", {
      method: "GET",
    });
  },

  /**
   * GET /api/tag/account/:accountId
   * Get all tags for a specific account
   */
  getByAccount: async (accountId: number): Promise<Tag[]> => {
    return apiRequest<Tag[]>(`/api/tag/account/${accountId}`, {
      method: "GET",
    });
  },

  /**
   * PUT /api/tag/:id
   * Update tag
   */
  update: async (
    id: number,
    data: UpdateTagRequest
  ): Promise<{ message: string; tag: Tag }> => {
    return apiRequest<{ message: string; tag: Tag }>(`/api/tag/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/tag/:id
   * Delete tag
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/tag/${id}`, {
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
