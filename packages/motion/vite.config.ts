import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { execSync } from 'node:child_process'

import path from 'node:path'

export default defineConfig({
  plugins: [
    vue() as any,
    vueJsx() as any,
    dts({
      cleanVueFileName: true,
      outDir: 'dist',
      exclude: ['src/test/**', 'src/**/story/**', 'src/**/*.story.vue'],
      afterBuild: async () => {
        // pnpm build:plugins
        execSync('pnpm build:plugins', { stdio: 'inherit', cwd: path.resolve(__dirname, '../plugins') })
      },
    }),

  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'framer-motion/dist/es/animation/utils/create-visual-element.mjs': path.resolve(__dirname, 'node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs'),
      'framer-motion/dist/es/render/store.mjs': path.resolve(__dirname, 'node_modules/framer-motion/dist/es/render/store.mjs'),
      'motion-value': path.resolve(__dirname, 'node_modules/framer-motion/dist/es/value/index.mjs'),
      'framer-main-animation': path.resolve(__dirname, 'node_modules/framer-motion/dist/es/animation/animators/MainThreadAnimation.mjs'),
    },
  },
  build: {
    lib: {
      name: 'motion-v',
      fileName: (format, name) => {
        return `${name}.${format === 'es' ? 'js' : 'umd.cjs'}`
      },
      entry: path.resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: [
        'vue',
        // 'framer-motion',
      ],
    },
  },
})
