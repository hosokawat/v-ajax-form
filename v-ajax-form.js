var VAjaxForm = (function (vue, axios) {
    'use strict';

    const TARGET_TAGS = ['input','select','textarea'];
    var script = vue.defineComponent({
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
                        if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
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

    const _hoisted_1 = ["action", "method"];

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createElementBlock("form", vue.mergeProps(_ctx.$attrs, {
        action: this.action,
        method: this.method,
        onSubmit: _cache[0] || (_cache[0] = vue.withModifiers((...args) => (_ctx.submit && _ctx.submit(...args)), ["prevent"]))
      }), [
        vue.renderSlot(_ctx.$slots, "default")
      ], 16 /* FULL_PROPS */, _hoisted_1))
    }

    script.render = render;
    script.__file = "src/components/VAjaxForm.vue";

    return script;

})(Vue, axios);
//# sourceMappingURL=v-ajax-form.js.map
