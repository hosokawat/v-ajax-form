var VAjaxForm = (function (vue) {
  'use strict';

  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  const _sfc_main = {
    name: "VAjaxForm",
    inheritAttrs: false,
    props: {
      action: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        default: "GET",
        validator: (value) =>
          ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(value.toUpperCase()),
      },
      uriEncode: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["start", "receive", "fail", "done"],
    methods: {
      request: function (params) {
        const vm = this;
        vm.$emit("start", params);

        const method = vm.method.toUpperCase();
        let url = vm.action;
        const options = { method: method };

        if (method === "GET") {
          const query = new URLSearchParams(params).toString();
          if (query) {
            url += (url.indexOf("?") >= 0 ? "&" : "?") + query;
          }
        } else if (method === "POST") {
          options.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
          };
          options.body = new URLSearchParams(params);
        } else {
          options.headers = { "Content-Type": "application/json" };
          options.body = JSON.stringify(params);
        }

        fetch(url, options)
          .then(function (response) {
            if (!response.ok) {
              throw new Error("HTTP error! status: " + response.status);
            }
            return response
              .text()
              .then(function (text) {
                try {
                  return JSON.parse(text);
                } catch (e) {
                  return text;
                }
              })
              .then(function (data) {
                vm.$emit("receive", {
                  data: data,
                  status: response.status,
                  statusText: response.statusText,
                });
              });
          })
          .catch(function (error) {
            vm.$emit("fail", error);
          })
          .finally(function () {
            vm.$emit("done", params);
          });
      },
      submit: function () {
        let params = {};
        let vm = this;
        vm.$el.querySelectorAll("input,select,textarea").forEach(function (el) {
          if (
            typeof el.attributes["disabled"] === "undefined" &&
            typeof el.attributes["name"] != "undefined"
          ) {
            if ((el.type === "radio" || el.type === "checkbox") && !el.checked)
              return;
            let val = el.value;
            let name = el.attributes["name"].value;
            if (vm.uriEncode) {
              val = encodeURIComponent(val);
              name = encodeURIComponent(name);
            }
            if (typeof params[name] === "undefined") {
              params[name] = val;
            } else if (params[name] instanceof Array) {
              params[name].push(val);
            } else {
              params[name] = [params[name], val];
            }
          }
        });
        vm.request(params);
      },
    },
  };

  const _hoisted_1 = ["action", "method"];

  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("form", vue.mergeProps(_ctx.$attrs, {
      action: $props.action,
      method: $props.method,
      onSubmit: _cache[0] || (_cache[0] = vue.withModifiers((...args) => ($options.submit && $options.submit(...args)), ["prevent"]))
    }), [
      vue.renderSlot(_ctx.$slots, "default")
    ], 16 /* FULL_PROPS */, _hoisted_1))
  }
  var VAjaxForm = /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render]]);

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

  return VAjaxFormPlugin;

})(Vue);
//# sourceMappingURL=v-ajax-form.js.map
