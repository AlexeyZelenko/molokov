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
                assetFileNames: 'assets/[name].[ext]',
                manualChunks(id) {
                    // Выносит vue и связанные пакеты в vendor_vue.js
                    if (id.includes('node_modules/vue') || id.includes('node_modules/@vue')) {
                        return 'vendor_vue';
                    }
                    // Выносит leaflet в vendor_leaflet.js
                    if (id.includes('node_modules/leaflet')) {
                        return 'vendor_leaflet';
                    }
                    // Выносит quill в vendor_quill.js
                    if (id.includes('node_modules/quill')) {
                        return 'vendor_quill';
                    }
                    // Выносит PrimeVue компоненты/утилиты и PrimeFlex
                    if (id.includes('node_modules/primevue') || id.includes('node_modules/primeflex')) {
                        return 'vendor_primevue';
                    }
                    if (id.includes('node_modules/chart.js')) {
                        return 'vendor_chartjs';
                    }
                }
            }
        },
    },
    // server: {
    //     host: '0.0.0.0',
    //     port: 5173,
    //     strictPort: true,
    //     hmr: {
    //         clientPort: 443,
    //     },
    //     allowedHosts: ['.ngrok-free.app'],
    // }

});
