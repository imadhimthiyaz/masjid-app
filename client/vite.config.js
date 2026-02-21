import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED') {
              if (res && !res.headersSent) {
                res.writeHead(err.code === 'ECONNREFUSED' ? 502 : 504)
                res.end(JSON.stringify({ error: 'Server unavailable. Is the backend running on port 3000?' }))
              }
              return
            }
            if (res && !res.headersSent) res.writeHead(502).end()
          })
        },
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
