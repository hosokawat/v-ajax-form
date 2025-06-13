import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'v-ajax-form.js',
    name: 'VAjaxForm',
    globals: {
      vue: 'Vue',
      axios: 'axios'
    }
  },
  external: ['vue', 'axios'],
  plugins: [
    vue({
      target: 'browser',
      preprocessStyles: false
    }),
    nodeResolve({
      browser: true
    }),
    commonjs()
  ],
};
