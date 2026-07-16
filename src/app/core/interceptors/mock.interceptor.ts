import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { Product } from '../models/models';

let MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'MacBook Pro 16"', description: 'M3 Max, 64GB RAM', price: 3499, stockQuantity: 15, isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Herman Miller Aeron', description: 'Ergonomic office chair', price: 1200, stockQuantity: 5, isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Logitech MX Master 3S', description: 'Wireless mouse', price: 99, stockQuantity: 150, isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'LG UltraFine 5K', description: '27-inch 5K monitor', price: 1299, stockQuantity: 8, isActive: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Keychron Q1 Pro', description: 'Mechanical keyboard', price: 199, stockQuantity: 0, isActive: false, createdAt: new Date().toISOString() },
];

export const mockInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const url = req.url;

  // 1. Mock Login
  if (url.endsWith('/auth/login') && req.method === 'POST') {
    const body = req.body as any;
    if (body.email === 'admin@test.com' && body.password === 'password') {
      return of(new HttpResponse({
        status: 200,
        body: {
          accessToken: 'mock-jwt-token-abc123',
          refreshToken: 'mock-refresh-token-xyz789',
          expiresIn: 3600,
          user: {
            id: 'u1',
            email: 'admin@test.com',
            firstName: 'Admin',
            lastName: 'User',
            roles: ['Admin']
          }
        }
      })).pipe(delay(800));
    }
    return throwError(() => new HttpErrorResponse({
      status: 401,
      error: { detail: 'Invalid credentials' }
    })).pipe(delay(800));
  }

  // 2. Mock Get Products
  if (url.includes('/products') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        items: MOCK_PRODUCTS,
        totalCount: MOCK_PRODUCTS.length,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      }
    })).pipe(delay(500));
  }

  // 3. Mock Dashboard Stats
  if (url.includes('/stats') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        totalProducts: 124,
        lowStockItems: 3,
        totalValue: 45200.50
      }
    })).pipe(delay(500));
  }

  // 4. Pass through
  return next(req);
};
