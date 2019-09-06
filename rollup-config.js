import vue from 'rollup-plugin-vue'; // .vueファイルimport用
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'v-ajax-form.js',
  },
  plugins: [
    commonjs(),
    vue(),
    buble(), // ES5 へトランスパイルする
  ],
};
