import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_SERVER_URL || 'http://localhost:5000';
  const wsTarget = env.VITE_WS_URL || backendTarget.replace(/^http/, 'ws');

  return {
    plugins: [react()],
    server: {
      host: true,
      // Allow this app to be served/embedded from any host. Useful for
      // sandboxed/proxied preview environments where the public URL differs
      // from localhost (Vite blocks unknown hosts by default).
      allowedHosts: true,
      // Proxy API/WebSocket calls to the backend during development so the
      // frontend can use relative URLs (avoiding CORS) when VITE_SERVER_URL /
      // VITE_WS_URL aren't explicitly set.
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/ws': {
          target: wsTarget,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
})
