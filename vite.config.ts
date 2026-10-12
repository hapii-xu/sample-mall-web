import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

// 固定端口 8898（strictPort）；host: true 允许真机经本机局域网 IP 访问 H5。
// /api 代理到后端网关（默认 http://localhost:8080，可用 VITE_API_TARGET 覆盖）。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8080';
  const proxy = { '/api': { target: apiTarget, changeOrigin: true } };
  return {
    plugins: [vue()],
    server: { port: 8898, strictPort: true, host: true, proxy },
    preview: { port: 8898, strictPort: true, host: true, proxy },
  };
});
