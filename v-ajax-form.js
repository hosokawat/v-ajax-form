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
                    }).finally(function () {
                        vm.$emit('done', params);
                    });
                }, submit: function () {
                    let params = {};
                    for (let el of this.$el.querySelectorAll('input,select,textarea')) {
                        if ((typeof el.attributes['disabled'] === 'undefined')
                            && (typeof el.attributes['name'] != 'undefined')
                        ) {
                            if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) continue;
                            let val = el.value;
                            let name = el.attributes['name'].value;
                            if (typeof params[name] === 'undefined') {
                                params[name] = val;
                            } else if (params[name] instanceof Array) {
                                params[name].push(val);
                            } else {
                                params[name] = [params[name], val];
                            }
                        }
                    }
                    this.request(params);
                }
            }, template: '<form v-bind="$attrs" :action="this.action" :method="this.method" @submit.prevent="submit"><slot></slot></form>'
        });
    }
}
