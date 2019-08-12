const VAjaxForm = {
    install(Vue, options) {
        Vue.component('VAjaxForm', {
            props: {
                action: String,
                method: String
            }, methods: {
                request: function (params) {
                    const vm = this;
                    vm.$emit('start', params);
                    axios[vm.method](vm.action, {
                        params: params
                    }).then(function (response) {
                        vm.$emit('receive', response);
                    }).catch(function (response) {
                        vm.$emit('fail', response);
                    }).then(function (response) {
                        vm.$emit('done', response);
                    });
                }, submit: function () {
                    let params = {};
                    for (let el of this.$el.querySelectorAll('input,select')) {
                        if ((typeof el.attributes['disabled'] == 'undefined') && (typeof el.attributes['name'] != 'undefined')) {
                            let val = el.value;
                            let name = el.attributes['name'].value;
                            params[name] = val;
                        }
                    }
                    this.request(params);
                }
            }, template: '<form v-bind="$attrs" :action="this.action" :method="this.method" @submit.prevent="submit"><slot></slot></form>'
        });
    }
}
