import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import VAjaxForm from "../../src/components/VAjaxForm.vue";

// fetch APIをモック
global.fetch = vi.fn();

describe("VAjaxForm", () => {
  beforeEach(() => {
    fetch.mockClear();
    // デフォルトで成功レスポンスを返すように設定
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve('{"result": "success"}'),
      json: () => Promise.resolve({ result: "success" }),
    });
  });

  it("正しくレンダリングされること", () => {
    const action = "/test";
    const method = "GET";
    const attr = "test-form";
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        attr: attr,
      },
    });

    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("form").attributes("action")).toBe(action);
    expect(wrapper.find("form").attributes("method")).toBe(method);
    expect(wrapper.find("form").attributes("attr")).toBe(attr);
  });

  it("プロパティが正しく設定されること", () => {
    const action = "/api/test";
    const method = "POST";
    const uriEncode = true;
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        uriEncode: uriEncode,
      },
    });

    expect(wrapper.vm.action).toBe(action);
    expect(wrapper.vm.method).toBe(method);
    expect(wrapper.vm.uriEncode).toBe(uriEncode);
  });

  it("スロットコンテンツが正しく表示されること", () => {
    const action = "/test";
    const method = "GET";
    const inputName = "test";
    const inputValue = "test-value";
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `<input name="${inputName}" value="${inputValue}">`,
      },
    });

    expect(wrapper.find(`input[name="${inputName}"]`).exists()).toBe(true);
    expect(wrapper.find(`input[name="${inputName}"]`).element.value).toBe(
      inputValue
    );
  });

  it("GETリクエストでフォーム送信が正しく動作すること", async () => {
    const action = "/api/test";
    const method = "GET";
    const paramName = "param1";
    const paramValue = "value1";
    const submitText = "送信";
    const expectedData = { [paramName]: paramValue };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve('{"result": "success"}'),
    });

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理の完了を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    // イベントが発火されたことを確認
    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  it("POSTリクエストでフォーム送信が正しく動作すること", async () => {
    const action = "/api/test";
    const method = "POST";
    const paramName = "param1";
    const paramValue = "value1";
    const submitText = "送信";
    const expectedData = { [paramName]: paramValue };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve('{"result": "success"}'),
    });

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理の完了を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  it("リクエストエラーが正しく処理されること", async () => {
    const action = "/api/test";
    const method = "GET";
    const paramName = "param1";
    const paramValue = "value1";
    const submitText = "送信";
    const expectedData = { [paramName]: paramValue };
    const error = new Error("Network error");

    fetch.mockRejectedValueOnce(error);

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  it("チェックボックスとラジオボタンが正しく処理されること", async () => {
    const action = "/test";
    const method = "GET";
    const checkbox1Name = "checkbox1";
    const checkbox1Value = "cb1";
    const checkbox2Name = "checkbox2";
    const checkbox2Value = "cb2";
    const radio1Name = "radio1";
    const radio1Value1 = "r1";
    const radio1Value2 = "r2";
    const expectedData = {
      [checkbox1Name]: checkbox1Value,
      [radio1Name]: radio1Value1,
    };

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `
          <input type="checkbox" name="${checkbox1Name}" value="${checkbox1Value}" checked>
          <input type="checkbox" name="${checkbox2Name}" value="${checkbox2Value}">
          <input type="radio" name="${radio1Name}" value="${radio1Value1}" checked>
          <input type="radio" name="${radio1Name}" value="${radio1Value2}">
        `,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理の完了を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  it("無効化された入力要素が無視されること", async () => {
    const action = "/test";
    const method = "GET";
    const enabledName = "enabled";
    const enabledValue = "enabled-value";
    const disabledName = "disabled";
    const disabledValue = "disabled-value";
    const expectedData = {
      [enabledName]: enabledValue,
    };

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
      },
      slots: {
        default: `
          <input name="${enabledName}" value="${enabledValue}">
          <input name="${disabledName}" value="${disabledValue}" disabled>
        `,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理の完了を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  it("uriEncodeプロパティが正しく動作すること", async () => {
    const action = "/test";
    const method = "GET";
    const uriEncode = true;
    const inputName = "test param";
    const inputValue = "test value";
    const encodedName = "test%20param";
    const encodedValue = "test%20value";
    const expectedData = {
      [encodedName]: encodedValue,
    };

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        uriEncode: uriEncode,
      },
      slots: {
        default: `<input name="${inputName}" value="${inputValue}">`,
      },
    });

    // フォーム送信をトリガー
    await wrapper.find("form").trigger("submit.prevent");

    // 非同期処理の完了を待機
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted()).toHaveProperty("start");
    expect(wrapper.emitted().start[0]).toEqual([expectedData]);
  });

  describe("ファイルアップロード", () => {
    it("ファイル入力がある場合にFormDataが使用されること", async () => {
      const action = "/upload";
      const method = "POST";
      const fileName = "test.txt";
      const fileContent = "test file content";
      const mockFile = new File([fileContent], fileName, { type: "text/plain" });

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: () => Promise.resolve('{"result": "uploaded"}'),
      });

      const wrapper = mount(VAjaxForm, {
        props: {
          action: action,
          method: method,
        },
        slots: {
          default: `
            <input name="file" type="file">
            <input name="description" value="test description">
          `,
        },
      });

      // ファイル入力にファイルを設定
      const fileInput = wrapper.find('input[type="file"]');
      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      });

      // フォーム送信をトリガー
      await wrapper.find("form").trigger("submit.prevent");

      // 非同期処理の完了を待機
      await new Promise((resolve) => setTimeout(resolve, 0));

      // fetchが正しいパラメータで呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(action, {
        method: "POST",
        body: expect.any(FormData),
      });

      // FormDataの内容を確認
      const callArgs = fetch.mock.calls[0];
      const formData = callArgs[1].body;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(mockFile);
      expect(formData.get('description')).toBe('test description');

      // イベントが発火されたことを確認
      expect(wrapper.emitted()).toHaveProperty("start");
      expect(wrapper.emitted().start[0][0]).toBeInstanceOf(FormData);
    });

    it("複数ファイル選択が正しく処理されること", async () => {
      const action = "/upload";
      const method = "POST";
      const file1 = new File(["content1"], "file1.txt", { type: "text/plain" });
      const file2 = new File(["content2"], "file2.txt", { type: "text/plain" });

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: () => Promise.resolve('{"result": "uploaded"}'),
      });

      const wrapper = mount(VAjaxForm, {
        props: {
          action: action,
          method: method,
        },
        slots: {
          default: `<input name="files" type="file" multiple>`,
        },
      });

      // ファイル入力に複数ファイルを設定
      const fileInput = wrapper.find('input[type="file"]');
      Object.defineProperty(fileInput.element, 'files', {
        value: [file1, file2],
        writable: false,
      });

      // フォーム送信をトリガー
      await wrapper.find("form").trigger("submit.prevent");

      // 非同期処理の完了を待機
      await new Promise((resolve) => setTimeout(resolve, 0));

      // fetchが正しいパラメータで呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(action, {
        method: "POST",
        body: expect.any(FormData),
      });

      // FormDataの内容を確認
      const callArgs = fetch.mock.calls[0];
      const formData = callArgs[1].body;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.getAll('files')).toEqual([file1, file2]);
    });

    it("ファイル入力とuriEncodeが併用できること", async () => {
      const action = "/upload";
      const method = "POST";
      const mockFile = new File(["content"], "file.txt", { type: "text/plain" });
      const testValue = "test value";

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: () => Promise.resolve('{"result": "uploaded"}'),
      });

      const wrapper = mount(VAjaxForm, {
        props: {
          action: action,
          method: method,
          uriEncode: true,
        },
        slots: {
          default: `
            <input name="file" type="file">
            <input name="test param" value="${testValue}">
          `,
        },
      });

      // ファイル入力にファイルを設定
      const fileInput = wrapper.find('input[type="file"]');
      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      });

      // フォーム送信をトリガー
      await wrapper.find("form").trigger("submit.prevent");

      // 非同期処理の完了を待機
      await new Promise((resolve) => setTimeout(resolve, 0));

      // FormDataの内容を確認
      const callArgs = fetch.mock.calls[0];
      const formData = callArgs[1].body;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(mockFile);
      // uriEncodeが適用されていることを確認
      expect(formData.get('test%20param')).toBe(encodeURIComponent(testValue));
    });

    it("GETメソッドでファイルアップロードを試行するとエラーになること", async () => {
      const action = "/upload";
      const method = "GET";
      const mockFile = new File(["content"], "file.txt", { type: "text/plain" });

      const wrapper = mount(VAjaxForm, {
        props: {
          action: action,
          method: method,
        },
        slots: {
          default: `<input name="file" type="file">`,
        },
      });

      // ファイル入力にファイルを設定
      const fileInput = wrapper.find('input[type="file"]');
      Object.defineProperty(fileInput.element, 'files', {
        value: [mockFile],
        writable: false,
      });

      // フォーム送信をトリガー
      await wrapper.find("form").trigger("submit.prevent");

      // 非同期処理の完了を待機
      await new Promise((resolve) => setTimeout(resolve, 0));

      // failイベントが発火されることを確認
      expect(wrapper.emitted()).toHaveProperty("fail");
      expect(wrapper.emitted().fail[0][0].message).toBe("File uploads are not supported with GET method");
    });

    it("PUT/DELETE/PATCHメソッドでもファイルアップロードが動作すること", async () => {
      const methods = ["PUT", "DELETE", "PATCH"];
      
      for (const method of methods) {
        const action = `/upload-${method.toLowerCase()}`;
        const mockFile = new File(["content"], "file.txt", { type: "text/plain" });

        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: () => Promise.resolve('{"result": "success"}'),
        });

        const wrapper = mount(VAjaxForm, {
          props: {
            action: action,
            method: method,
          },
          slots: {
            default: `<input name="file" type="file">`,
          },
        });

        // ファイル入力にファイルを設定
        const fileInput = wrapper.find('input[type="file"]');
        Object.defineProperty(fileInput.element, 'files', {
          value: [mockFile],
          writable: false,
        });

        // フォーム送信をトリガー
        await wrapper.find("form").trigger("submit.prevent");

        // 非同期処理の完了を待機
        await new Promise((resolve) => setTimeout(resolve, 0));

        // fetchが正しいパラメータで呼ばれたことを確認
        expect(fetch).toHaveBeenCalledWith(action, {
          method: method,
          body: expect.any(FormData),
        });

        fetch.mockClear();
      }
    });
  });
});
