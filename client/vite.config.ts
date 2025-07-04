import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import unpluginAutoImport from "unplugin-auto-import/vite"
import unpluginElementPlus from 'unplugin-element-plus/vite'
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    unpluginAutoImport({
      dts: "./src/types/imports.d.ts",
      include: [/\.ts?$/, /\.tsx?$/],
      imports: [
        "vue",
      ],
    }),
    unpluginElementPlus({}),
    vanillaExtractPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
