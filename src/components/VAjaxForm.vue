<template>
  <form
    ref="formRef"
    v-bind="$attrs"
    :action="action"
    :method="method"
    @submit.prevent="submit"
  >
    <slot></slot>
  </form>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
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
});

const emit = defineEmits(["start", "receive", "fail", "done"]);

defineOptions({
  name: "VAjaxForm",
  inheritAttrs: false,
});

// テンプレート参照をフォールバックとして用意
const formRef = ref(null);

const request = async (params) => {
  emit("start", params);

  const method = props.method.toUpperCase();
  let url = props.action;
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

    emit("receive", {
      data: data,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    emit("fail", error);
  } finally {
    emit("done", params);
  }
};

const submit = () => {
  const params = {};

  const form = formRef.value;

  if (!form) {
    console.warn("VAjaxForm: Could not access form element");
    return;
  }

  form.querySelectorAll("input,select,textarea").forEach((el) => {
    if (
      typeof el.attributes["disabled"] === "undefined" &&
      typeof el.attributes["name"] != "undefined"
    ) {
      if ((el.type === "radio" || el.type === "checkbox") && !el.checked)
        return;
      let val = el.value;
      let name = el.attributes["name"].value;
      if (props.uriEncode) {
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
  request(params);
};
</script>
