import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
    base: '/Binks-Melody/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                home: resolve(__dirname, 'home.html'),
                playlists: resolve(__dirname, 'playlists.html'),
                settings: resolve(__dirname, 'settings.html'),
                account: resolve(__dirname, 'account.html')
            },
        },
    },
});