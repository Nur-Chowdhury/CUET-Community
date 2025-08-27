import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default {
//   build: {
//     outDir: "dist", // default
//   },
// };
export default defineConfig({
  envDir: '../',
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174', // backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
