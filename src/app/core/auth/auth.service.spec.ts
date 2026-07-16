import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponse, UserInfo } from '../models/models';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: UserInfo = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['User']
  };

  const mockAdminUser: UserInfo = {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['User', 'Admin']
  };

  const mockAuthResponse: AuthResponse = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    expiresIn: 3600,
    user: mockUser
  };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null user when localStorage is empty', () => {
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  // ─── Signals ────────────────────────────────────────────────────────────────

  it('isAuthenticated should return true after login', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));

    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('displayName should return full name after login', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));

    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    expect(service.displayName()).toBe('Test User');
  });

  it('isAdmin should return false for regular user', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));

    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    expect(service.isAdmin()).toBeFalse();
  });

  it('isAdmin should return true for admin user', () => {
    const adminResponse: AuthResponse = { ...mockAuthResponse, user: mockAdminUser };
    httpSpy.post.and.returnValue(of(adminResponse));

    service.login({ email: 'admin@example.com', password: 'password' }).subscribe();

    expect(service.isAdmin()).toBeTrue();
  });

  // ─── Login ──────────────────────────────────────────────────────────────────

  it('login should store tokens in localStorage', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));

    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    expect(localStorage.getItem('access_token')).toBe('test-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
  });

  it('login should store user info in localStorage', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));

    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    const stored = JSON.parse(localStorage.getItem('user_info')!);
    expect(stored.email).toBe('test@example.com');
  });

  // ─── Logout ─────────────────────────────────────────────────────────────────

  it('logout should clear localStorage and reset user signal', () => {
    httpSpy.post.and.returnValue(of(mockAuthResponse));
    service.login({ email: 'test@example.com', password: 'password' }).subscribe();

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('user_info')).toBeNull();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logout should navigate to /auth/login', () => {
    service.logout();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  // ─── Token accessors ────────────────────────────────────────────────────────

  it('getAccessToken should return stored token', () => {
    localStorage.setItem('access_token', 'my-token');

    expect(service.getAccessToken()).toBe('my-token');
  });

  it('getRefreshToken should return stored refresh token', () => {
    localStorage.setItem('refresh_token', 'my-refresh-token');

    expect(service.getRefreshToken()).toBe('my-refresh-token');
  });

  it('getAccessToken should return null when no token stored', () => {
    expect(service.getAccessToken()).toBeNull();
  });

  // ─── Refresh token ──────────────────────────────────────────────────────────

  it('refreshToken should update tokens on success', () => {
    localStorage.setItem('refresh_token', 'old-refresh-token');
    const newResponse: AuthResponse = {
      ...mockAuthResponse,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    };
    httpSpy.post.and.returnValue(of(newResponse));

    service.refreshToken().subscribe();

    expect(localStorage.getItem('access_token')).toBe('new-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token');
  });

  it('refreshToken should logout on failure', () => {
    localStorage.setItem('refresh_token', 'old-refresh-token');
    httpSpy.post.and.returnValue(throwError(() => new Error('Refresh failed')));

    service.refreshToken().subscribe({
      error: () => {
        expect(service.isAuthenticated()).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      }
    });
  });
});
