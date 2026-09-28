import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Chuyển tiếp các API call bắt đầu bằng /api hoặc /health sang Backend
      '/api': {
        target: 'http://localhost:5000', // Đảm bảo đúng PORT Backend của bạn (vd: 5000 hoặc 8000)
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
});