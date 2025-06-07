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
import { ref, computed } from "vue";

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

// ファイル入力があるかどうかを判定
const hasFileInputs = computed(() => {
  return formRef.value?.querySelector('input[type="file"]') !== null;
});

const request = async (params) => {
  emit("start", params);

  try {
    const method = props.method.toUpperCase();
    let url = props.action;
    const options = { method: method };

    if (method === "GET") {
      // ファイルアップロードの場合はGETメソッドは使用できない
      if (params instanceof FormData) {
        throw new Error("File uploads are not supported with GET method");
      }
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += (url.indexOf("?") >= 0 ? "&" : "?") + query;
      }
    } else if (method === "POST") {
      if (params instanceof FormData) {
        // FormDataの場合はContent-Typeヘッダーを設定しない（ブラウザが自動設定）
        options.body = params;
      } else {
        options.headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
        options.body = new URLSearchParams(params);
      }
    } else {
      if (params instanceof FormData) {
        // PUT, DELETE, PATCHでもFormDataをサポート
        options.body = params;
      } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(params);
      }
    }

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

const collectFormData = () => {
  const form = formRef.value;

  if (!form) {
    console.warn("VAjaxForm: Could not access form element");
    return null;
  }

  // ファイル入力がある場合はFormDataを使用
  if (hasFileInputs.value) {
    const formData = new FormData();
    
    form.querySelectorAll("input,select,textarea").forEach((el) => {
      if (
        typeof el.attributes["disabled"] === "undefined" &&
        typeof el.attributes["name"] !== "undefined"
      ) {
        const name = el.attributes["name"].value;
        
        if (el.type === "file") {
          // ファイル入力の処理
          Array.from(el.files || []).forEach((file) => {
            formData.append(name, file);
          });
        } else if ((el.type === "radio" || el.type === "checkbox") && !el.checked) {
          return;
        } else {
          let val = el.value;
          if (props.uriEncode) {
            val = encodeURIComponent(val);
          }
          formData.append(props.uriEncode ? encodeURIComponent(name) : name, val);
        }
      }
    });
    
    return formData;
  } else {
    // 通常のフォームデータ処理
    const params = {};
    
    form.querySelectorAll("input,select,textarea").forEach((el) => {
      if (
        typeof el.attributes["disabled"] === "undefined" &&
        typeof el.attributes["name"] !== "undefined"
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
    
    return params;
  }
};

const submit = async () => {
  const formData = collectFormData();
  if (formData !== null) {
    await request(formData);
  }
};
</script>
