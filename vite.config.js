import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    root: './src',
    build: {
      outDir: '../dist',
      minify: false,
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://newcore.nexeratech.co.id',
          changeOrigin: true,
          secure: !env.VITE_API_URL || env.VITE_API_URL.startsWith('https'),
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    }
  };
});