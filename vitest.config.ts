import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/adapters/react/index.ts',
        'src/adapters/react/components/parts.tsx',
        'src/adapters/react/context.ts',
        'src/utils/scroll.ts',
        'src/index.ts',
        'src/types.ts', // Type guards are simple
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 75,
        lines: 85,
      },
    },
  },
})
