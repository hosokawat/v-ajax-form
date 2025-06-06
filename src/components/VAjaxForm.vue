<template>
  <form
    v-bind="$attrs"
    :action="action"
    :method="method"
    @submit.prevent="submit"
  >
    <slot></slot>
  </form>
</template>
<script>
export default {
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
    request: async function (params) {
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

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text;
        }

        vm.$emit("receive", {
          data: data,
          status: response.status,
          statusText: response.statusText,
        });
      } catch (error) {
        vm.$emit("fail", error);
      } finally {
        vm.$emit("done", params);
      }
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
</script>
