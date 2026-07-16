# Contributing to angular-enterprise-app

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a **feature branch** from `develop`: `git checkout -b feature/your-feature develop`
4. Make your changes
5. **Run tests** to ensure nothing is broken
6. **Commit** with a clear message
7. **Push** to your fork and create a **Pull Request** against `develop`

## Development Setup

```bash
# Clone
git clone https://github.com/<your-username>/angular-enterprise-app.git
cd angular-enterprise-app

# Install dependencies
npm install

# Start dev server (connects to localhost:5000 by default)
npm start

# Run tests
npm test

# Build for production
npm run build
```

> **Note:** The app expects `dotnet-enterprise-api` running on `http://localhost:5000/api`. See the [local dev setup runbook](https://github.com/ericksonlopezf/engineering-handbook/blob/main/runbooks/local-dev-setup.md) for full-stack instructions.

## Code Standards

- **Prettier** — formatting enforced via `.prettierrc`
- **EditorConfig** — consistent editor settings via `.editorconfig`
- **TypeScript strict mode** — all types must be explicit
- **Angular Signals** — use Signals for state management, not NgRx
- **Standalone components** — no NgModules

## Pull Request Guidelines

- **One concern per PR** — keep changes focused
- **Include tests** — component and service tests
- **Update CHANGELOG.md** — add your changes under `[Unreleased]`
- **Follow the architecture** — `core/`, `features/`, `shared/` structure
- **Use Tailwind CSS 4** — follow the existing design system tokens

## What to Contribute

- 🐛 Bug fixes with steps to reproduce
- 📖 Documentation improvements
- ✨ New features (open an issue first to discuss)
- 🎨 UI/UX improvements following the existing design system

## What NOT to Contribute

- ❌ State management libraries (NgRx, Akita, etc.) — Signals are the chosen approach
- ❌ CSS frameworks other than Tailwind CSS 4
- ❌ Breaking changes without prior discussion
- ❌ Build artifacts (`dist/`, `node_modules/`)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
