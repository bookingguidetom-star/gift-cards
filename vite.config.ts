import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Local Base44 sandbox: the app expects Supabase's `/rest/v1/*` data API. The
// compose stack runs PostgREST behind this dev server so the browser stays on a
// single origin. Outside the sandbox the flag is unset and VITE_SUPABASE_URL
// points straight at Supabase.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  ...(previewMode
    ? {
        server: {
          // Bind mounts in the sandbox do not always emit inotify events.
          watch: { usePolling: true, interval: 300 },
          proxy: {
            '/rest/v1': {
              target: 'http://api:3000',
              changeOrigin: true,
              rewrite: (path: string) => path.replace(/^\/rest\/v1/, ''),
            },
          },
        },
      }
    : {}),
});
