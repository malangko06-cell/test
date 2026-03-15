import { defineConfig } from 'vite';

export default defineConfig({
    base: '/test/',
    server: {
        host: true,
        port: 5173,
        open: true,
        strictPort: true
    }
});
