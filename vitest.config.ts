import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json', 'html'],
    },
    projects: [
      {
        plugins: [
          vue(),
          AutoImport({
            imports: ['vue'],
            dts: false,
          }),
        ],
        resolve: {
          alias: {
            '@': resolve(__dirname, 'app'),
          },
        },
        test: {
          name: 'unit',
          include: ['**/*.{test,spec}.{ts,js}'],
          exclude: ['test/nuxt/**', '**/node_modules/**'],
          environment: 'happy-dom',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
    ],
  },
});