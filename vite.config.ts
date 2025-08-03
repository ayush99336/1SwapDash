import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/1inch': {
          target: 'https://api.1inch.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/1inch/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_1INCH_API_KEY}`,
          },
        },
      },
    },
  }
})
