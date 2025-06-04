import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'VAjaxForm',
      formats: ['iife'],
      fileName: () => 'v-ajax-form.js'
    },
    sourcemap: true
  }
})
