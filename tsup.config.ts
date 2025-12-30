import { defineConfig } from 'tsup'

export default defineConfig([
  // Core bundle
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: true,
    outDir: 'dist',
  },
  // React bundle
  {
    entry: ['src/adapters/react/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: true,
    outDir: 'dist/react',
    external: ['react', 'react-dom', '@oxog/selectkit'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      }
    },
  },
])
