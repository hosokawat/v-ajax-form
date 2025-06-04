import VAjaxForm from './components/VAjaxForm.vue'

const plugin = {
  install(app) {
    app.component('VAjaxForm', VAjaxForm)
  }
}

export { VAjaxForm }
export default plugin
