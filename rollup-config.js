import vue from '@vitejs/plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'v-ajax-form.js',
    name: 'VAjaxForm',
    globals: {
      vue: 'Vue'
    }
  },
  plugins: [
    vue(),
    commonjs(),
    // 本番用の圧縮版も生成
    ...(process.env.NODE_ENV === 'production' ? [terser()] : [])
  ],
  external: ['vue'],
};
