import VAjaxForm from './components/VAjaxForm.vue';

const VAjaxFormPlugin = {
  install(Vue) {
    Vue.component('v-ajax-form', VAjaxForm);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VAjaxFormPlugin);
}

export default VAjaxFormPlugin;
