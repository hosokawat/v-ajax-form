<template>
    <form v-bind="$attrs" :action="this.action" :method="this.method" @submit.prevent="submit">
        <slot></slot>
    </form>
</template>
<script>
export default {
    props: {
        action: String,
        method: String,
        uriEncode: Boolean
    }, methods: {
        request: function (params) {
            const vm = this;
            vm.$emit('start', params);
            const method = vm.method.toUpperCase();
            let url = vm.action;
            const options = { method: method };
            if (method === 'GET') {
                const query = new URLSearchParams(params).toString();
                if (query) {
                    url += (url.indexOf('?') >= 0 ? '&' : '?') + query;
                }
            } else if (method === 'POST') {
                options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                options.body = new URLSearchParams(params);
            } else {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(params);
            }
            fetch(url, options)
                .then(async function (response) {
                    if (!response.ok) throw response;
                    let data;
                    try {
                        data = await response.clone().json();
                    } catch (e) {
                        data = await response.text();
                    }
                    vm.$emit('receive', { data: data, status: response.status, statusText: response.statusText, headers: response.headers });
                })
                .catch(function (response) {
                    vm.$emit('fail', response);
                })
                .finally(function () {
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
