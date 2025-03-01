import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import commonjs from 'vite-plugin-commonjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    base: '/',
    optimizeDeps: {
        include: ['tiny-case', 'property-expr', 'quill'],
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        }),
        vueDevTools(),
        commonjs(),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/leaflet/dist/images/*',
                    dest: 'leaflet-images'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    },
    server: {
        host: '0.0.0.0', // Чтобы принимать запросы со всех IP
        port: 5173, // Порт по умолчанию
        strictPort: true,
        hmr: {
            clientPort: 443, // Нужно для работы через ngrok
        },
        allowedHosts: ['.ngrok-free.app'], // Разрешаем ngrok-домены
    }

});
