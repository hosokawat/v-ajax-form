<template>
    <form v-bind="$attrs" :action="this.action" :method="this.method" @submit.prevent="submit">
        <slot></slot>
    </form>
</template>
<script>
module.exports = {
    props: {
        action: String,
        method: String,
        uriEncode: Boolean
    }, methods: {
        request: function (params) {
            const vm = this;
            vm.$emit('start', params);
            let ax_op2 = {};
            let _method = vm.method.toLowerCase();
            switch (vm.method) {
                case 'get':
                    ax_op2 = {params: params};
                    break;
                case 'post':
                    ax_op2 = params;
                    break;
            }
            axios[_method](vm.action,
                ax_op2
            ).then(function (response) {
                vm.$emit('receive', response);
            }).catch(function (response) {
                vm.$emit('fail', response);
            }).finally(function () {
                vm.$emit('done', params);
            });
        }, submit: function () {
            let params = {};
            let vm = this;
            vm.$el.querySelectorAll('input,select,textarea').forEach(function(el){
                if ((typeof el.attributes['disabled'] === 'undefined')
                    && (typeof el.attributes['name'] != 'undefined')
                ) {
                    if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
                    let val = el.value;
                    let name = el.attributes['name'].value;
                    if(vm.uriEncode) {
                        val = encodeURIComponent(val);
                        name = encodeURIComponent(name);
                    }
                    if (typeof params[name] === 'undefined') {
                        params[name] = val;
                    } else if (params[name] instanceof Array) {
                        params[name].push(val);
                    } else {
                        params[name] = [params[name], val];
                    }
                }
            });
            vm.request(params);
        }
    }
}
</script>
