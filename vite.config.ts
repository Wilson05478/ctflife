import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  server: {
        port: 5173,
        host: '0.0.0.0',
        proxy: {
          '/users': {
            target: 'https://ctflife-demo.zeabur.app',
            changeOrigin: true,
            secure: false,
          },
          '/student': {
            target: 'https://ctflife-demo.zeabur.app',
            changeOrigin: true,
            secure: false,
          },
          '/auth': {
            target: 'https://ctflife-demo.zeabur.app',
            changeOrigin: true,
            secure: false,
          },
          '/course_content': {
            target: 'https://ctflife-demo.zeabur.app',
            changeOrigin: true,
            secure: false,
          },
        }
  },
})
