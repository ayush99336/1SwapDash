import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/1inch': {
          target: 'https://api.1inch.dev',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/1inch/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_1INCH_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        // Separate proxy for Web3 RPC API
        '/api/web3': {
          target: 'https://api.1inch.dev/web3',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/web3/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_1INCH_API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Web3 RPC proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Web3 RPC Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Web3 RPC Response:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  }
})
