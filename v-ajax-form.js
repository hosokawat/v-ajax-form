var VAjaxForm = (function () {
    'use strict';

    //
    //
    //
    //
    //

    var script = {
        name: 'VAjaxForm',
        inheritAttrs: false,
        props: {
            action: {
                type: String,
                required: true
            },
            method: {
                type: String,
                default: 'GET',
                validator: (value) => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(value.toUpperCase())
            },
            uriEncode: {
                type: Boolean,
                default: false
            }
        },
        emits: ['start', 'receive', 'fail', 'done'],
        methods: {
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
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('HTTP error! status: ' + response.status);
                        }
                        return response.text().then(function(text) {
                            try {
                                return JSON.parse(text);
                            } catch (e) {
                                return text;
                            }
                        }).then(function(data) {
                            vm.$emit('receive', { 
                                data: data, 
                                status: response.status, 
                                statusText: response.statusText
                            });
                        });
                    })
                    .catch(function (error) {
                        vm.$emit('fail', error);
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
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
        }
        return script;
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "form",
        _vm._b(
          {
            attrs: { action: _vm.action, method: _vm.method },
            on: {
              submit: function ($event) {
                $event.preventDefault();
                return _vm.submit.apply(null, arguments)
              },
            },
          },
          "form",
          _vm.$attrs,
          false
        ),
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__);

    const VAjaxFormPlugin = {
      install(Vue) {
        Vue.component('v-ajax-form', __vue_component__);
      }
    };

    if (typeof window !== 'undefined' && window.Vue) {
      window.Vue.use(VAjaxFormPlugin);
    }

    return VAjaxFormPlugin;

})();
//# sourceMappingURL=v-ajax-form.js.map
