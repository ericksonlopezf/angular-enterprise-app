import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run *.test.ts files (vitest-style).
    // Existing *.spec.ts files use Jasmine/Karma and are excluded intentionally.
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/main.ts', 'src/environments/**'],
    },
  },
});
