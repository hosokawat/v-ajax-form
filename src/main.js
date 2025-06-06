import VAjaxForm from "./components/VAjaxForm.vue";

const VAjaxFormPlugin = {
  install(app) {
    app.component("v-ajax-form", VAjaxForm);
  },
};

// Auto-install when Vue is found (browser)
if (typeof window !== "undefined" && window.Vue && window.Vue.createApp) {
  // Vue 3のグローバル変数として利用可能にする
  window.VAjaxForm = VAjaxFormPlugin;
}

export default VAjaxFormPlugin;
