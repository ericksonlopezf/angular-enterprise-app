# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-07-16

### Added
- Angular 22 SPA with standalone components and new control flow (`@if`, `@for`)
- Angular Signals state management (AuthService, ProductService, ToastService)
- JWT authentication with refresh token rotation (jwtInterceptor)
- Functional guards (authGuard, adminGuard, guestGuard)
- Product CRUD with paginated table, search, and create modal
- Dashboard with KPI stats and recent products mini-table
- Tailwind CSS 4 design system (dark theme, glassmorphism, animations)
- Prettier + EditorConfig code formatting
- GitHub Actions CI (build + type check)

[Unreleased]: https://github.com/ericksonlopezf/angular-enterprise-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ericksonlopezf/angular-enterprise-app/releases/tag/v1.0.0
