import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { authGuard, adminGuard, guestGuard } from './guards';

describe('Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
      isAdmin: jasmine.createSpy('isAdmin').and.returnValue(false)
    });
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as any);

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/products' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  // ─── authGuard ────────────────────────────────────────────────────────────

  describe('authGuard', () => {
    it('should allow access when user is authenticated', () => {
      (authServiceSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to /auth/login when user is not authenticated', () => {
      (authServiceSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/products' } }
      );
    });
  });

  // ─── adminGuard ───────────────────────────────────────────────────────────

  describe('adminGuard', () => {
    it('should allow access when user is admin', () => {
      (authServiceSpy.isAdmin as jasmine.Spy).and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to /dashboard when user is not admin', () => {
      (authServiceSpy.isAdmin as jasmine.Spy).and.returnValue(false);

      TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  // ─── guestGuard ───────────────────────────────────────────────────────────

  describe('guestGuard', () => {
    it('should allow access when user is NOT authenticated', () => {
      (authServiceSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to /dashboard when user IS authenticated', () => {
      (authServiceSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);

      TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
