(function () {
    'use strict';

    //
    //
    //
    //
    //

    var VAjaxForm_vue_rollupPluginVue_script = {
        props: {
            action: String,
            method: String
        }, methods: {
            request: function (params) {
                var vm = this;
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
                var params = {};
                this.$el.querySelectorAll('input,select,textarea').forEach(function(el){
                    if ((typeof el.attributes['disabled'] === 'undefined')
                        && (typeof el.attributes['name'] != 'undefined')
                    ) {
                        if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) { return; }
                        var val = el.value;
                        var name = el.attributes['name'].value;
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
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    /* script */
    var __vue_script__ = VAjaxForm_vue_rollupPluginVue_script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "form",
        _vm._b(
          {
            attrs: { action: this.action, method: this.method },
            on: {
              submit: function($event) {
                $event.preventDefault();
                return _vm.submit($event)
              }
            }
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
      var __vue_inject_styles__ = undefined;
      /* scoped */
      var __vue_scope_id__ = undefined;
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var VAjaxForm = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    Vue.component('VAjaxForm', VAjaxForm);

}());
//# sourceMappingURL=v-ajax-form.js.map
