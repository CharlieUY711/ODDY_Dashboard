import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'resolve-modulos-deps',
      resolveId(id, importer) {
        if (importer?.toLowerCase().includes('modulos') && !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('@/')) {
          try {
            return require.resolve(id, { paths: [path.resolve(__dirname, 'node_modules')] });
          } catch {}
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modulos': path.resolve(__dirname, './src/_modulos'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
