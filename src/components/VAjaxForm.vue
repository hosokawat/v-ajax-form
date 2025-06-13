<template>
    <form v-bind="$attrs" :action="this.action" :method="this.method" @submit.prevent="submit">
        <slot></slot>
    </form>
</template>
<script>
import { defineComponent } from 'vue';
import axios from 'axios';

const TARGET_TAGS = ['input','select','textarea'];
const CHECK_ELEMENTS = ['radio', 'checkbox'];
export default defineComponent({
    name: 'VAjaxForm',
    props: {
        action: String,
        method: String,
        uriEncode: Boolean
    }, methods: {
        request(params) {
            this.$emit('start', params);
            let axiosRequestConfig = {};
            let _method = this.method.toLowerCase();
            switch (this.method) {
                case 'get':
                    axiosRequestConfig = {params: params};
                    break;
                case 'post':
                    axiosRequestConfig = params;
                    break;
            }
            axios[_method](this.action, axiosRequestConfig)
                .then((response) => {
                    this.$emit('receive', response);
                })
                .catch((response) => {
                    this.$emit('fail', response);
                })
                .finally(() => {
                    this.$emit('done', params);
                });
        }, submit() {
            let params = {};
            this.$el.querySelectorAll(TARGET_TAGS.join(",")).forEach((el) => {
                if ((typeof el.attributes['disabled'] === 'undefined')
                    && (typeof el.attributes['name'] != 'undefined')
                ) {
                    if (CHECK_ELEMENTS.includes(el.type) && !el.checked) return;
                    let val = el.value;
                    let name = el.attributes['name'].value;
                    if(this.uriEncode) {
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
            this.request(params);
        }
    }
});
</script>
