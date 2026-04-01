import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()], // Faz o Vitest entender o @/ e test/
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' sem importar em todo arquivo
  },
});
