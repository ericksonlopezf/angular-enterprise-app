// ─── Auth models ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// ─── Product models ───────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  initialStock: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface AdjustStockRequest {
  quantity: number;
}

// ─── Pagination models ────────────────────────────────────────────────────────

export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ─── API models ───────────────────────────────────────────────────────────────

export interface ApiError {
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
