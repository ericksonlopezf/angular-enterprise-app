import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, filter, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * JWT Interceptor:
 * 1. Attaches Bearer token to every outgoing request (except auth endpoints).
 * 2. On 401: attempts token refresh once, then retries original request.
 * 3. If refresh fails: logs out and redirects to login.
 */
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAccessToken();
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (!token || isAuthEndpoint) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (auth.getAccessToken() !== token) {
        // Token was already refreshed by a concurrent request — retry with new token
        const retryReq = req.clone({
          setHeaders: { Authorization: `Bearer ${auth.getAccessToken()}` }
        });
        return next(retryReq);
      }

      // Attempt refresh
      auth.setRefreshing(true);
      return auth.refreshToken().pipe(
        switchMap(response => {
          auth.setRefreshing(false);
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          });
          return next(retryReq);
        }),
        catchError(refreshError => {
          auth.setRefreshing(false);
          auth.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};

/**
 * Error Interceptor:
 * Transforms HTTP errors into user-readable messages.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.error?.detail) {
        message = error.error.detail;
      } else if (error.error?.title) {
        message = error.error.title;
      } else if (error.status === 0) {
        message = 'Unable to reach the server. Check your connection.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      }

      return throwError(() => ({ ...error, userMessage: message }));
    })
  );
};
