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
    }

});
