# angular-enterprise-app

[![CI](https://img.shields.io/github/actions/workflow/status/ericksonlopezf/angular-enterprise-app/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI)](https://github.com/ericksonlopezf/angular-enterprise-app/actions)
[![Angular](https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

Enterprise-grade SPA template built with **Angular 22**, **Angular Signals**, and **Tailwind CSS 4**.

> **Companion frontend** for [`dotnet-enterprise-api`](https://github.com/ericksonlopezf/dotnet-enterprise-api). Demonstrates a complete full-stack integration: auth flow, CRUD with pagination, JWT refresh rotation, and enterprise-quality UI patterns.

---

## Architecture

```
src/app/
├── core/
│   ├── auth/                 ← AuthService (Signals: user, isAuthenticated, isAdmin)
│   ├── interceptors/         ← jwtInterceptor (refresh rotation) + errorInterceptor
│   ├── guards/               ← authGuard, adminGuard, guestGuard (functional)
│   ├── models/               ← TypeScript interfaces (Product, Auth, PagedList<T>)
│   └── services/             ← ProductService, ToastService (Signals)
├── features/                 ← Lazy-loaded feature modules
│   ├── auth/login/           ← Login page (password visibility toggle, form validation)
│   ├── auth/register/        ← Register page (password strength meter)
│   ├── dashboard/            ← Stats overview + recent products mini-table
│   └── products/
│       ├── list/             ← Paginated table + search + Create modal
│       └── detail/           ← Edit form + stock adjustment
└── shared/
    └── components/toast/     ← Signal-based toast notifications
```

---

## Key Patterns

### Angular Signals State Management

```typescript
// AuthService — reactive signals, no NgRx needed for this scale
readonly user = signal<UserInfo | null>(null);
readonly isAuthenticated = computed(() => this._user() !== null);
readonly isAdmin = computed(() => this._user()?.roles.includes('Admin') ?? false);
readonly displayName = computed(() => {
  const u = this._user();
  return u ? `${u.firstName} ${u.lastName}` : '';
});
```

### JWT Interceptor with Refresh Rotation

```
Request → jwtInterceptor → attach Bearer token → API
                401?
                  ↓
            POST /auth/refresh → new access token → retry original request
                  ↓ (on refresh failure)
            logout() → redirect to /auth/login
```

### Functional Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
```

### New Angular Control Flow (@if / @for / @switch)

```html
@for (product of data()?.items; track product.id) {
  <tr class="table-row">...</tr>
}
@if (data()?.hasNextPage) {
  <button (click)="goToPage(currentPage() + 1)">Next</button>
}
```

---

## Pages

| Route | Guard | Description |
|---|---|---|
| `/auth/login` | guestGuard | Email + password, show/hide password toggle |
| `/auth/register` | guestGuard | Registration with real-time password strength meter |
| `/dashboard` | authGuard | KPI stats, recent products table, sidebar navigation |
| `/products` | authGuard | Paginated CRUD table, search, create modal |
| `/products/:id` | authGuard | Detail + edit form + stock adjustment |

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Angular | 22 | SPA framework |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 4 | Styling (dark theme, glassmorphism) |
| Angular Signals | built-in | Reactive state (no NgRx) |
| RxJS | 7 | HTTP streams, debounced search |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (connects to localhost:5000 by default)
npm start

# Build for production
npm run build
```

**API connection:** configure `src/environments/environment.ts` → `apiUrl`.

The app expects `dotnet-enterprise-api` to be running on `http://localhost:5000/api`.

---

## Design System

Built with Tailwind CSS 4 `@theme` tokens:

- **Colors:** Deep indigo/violet dark palette (`surface-950` → `surface-500`)
- **Components:** `.glass-card`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.badge-*`, `.nav-link`
- **Animations:** `fadeIn`, `slideUp`, `slideInRight` (CSS @keyframes, staggered via `animation-delay`)
- **Typography:** Inter from Google Fonts

---

## Related Repositories

| Repo | Role |
|---|---|
| [`dotnet-enterprise-api`](https://github.com/ericksonlopezf/dotnet-enterprise-api) | Backend API (JWT auth + products CRUD) |
| [`dotnet-shared-kernel`](https://github.com/ericksonlopezf/dotnet-shared-kernel) | Shared domain abstractions |
| [`dapper-extensions-pg`](https://github.com/ericksonlopezf/dapper-extensions-pg) | PostgreSQL extensions |

---

## License

MIT © [Erickson López](https://github.com/ericksonlopezf)
