import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VAjaxForm from '../../src/components/VAjaxForm.vue'

// fetch APIをモック
global.fetch = vi.fn()

describe('VAjaxForm', () => {
  beforeEach(() => {
    fetch.mockClear()
    // デフォルトで成功レスポンスを返すように設定
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve('{"result": "success"}'),
      json: () => Promise.resolve({ result: 'success' })
    })
  })

  it('正しくレンダリングされること', () => {
    const action = '/test';
    const method = 'GET';
    const attr = 'test-form';
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        attr: attr
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('form').attributes('action')).toBe(action)
    expect(wrapper.find('form').attributes('method')).toBe(method)
    expect(wrapper.find('form').attributes('attr')).toBe(attr)
  })

  it('プロパティが正しく設定されること', () => {
    const action = '/api/test';
    const method = 'POST';
    const uriEncode = true;
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        uriEncode: uriEncode
      }
    })

    expect(wrapper.vm.action).toBe(action)
    expect(wrapper.vm.method).toBe(method)
    expect(wrapper.vm.uriEncode).toBe(uriEncode)
  })

  it('スロットコンテンツが正しく表示されること', () => {
    const action = '/test';
    const method = 'GET';
    const inputName = 'test';
    const inputValue = 'test-value';
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `<input name="${inputName}" value="${inputValue}">`
      }
    })

    expect(wrapper.find(`input[name="${inputName}"]`).exists()).toBe(true)
    expect(wrapper.find(`input[name="${inputName}"]`).element.value).toBe(inputValue)
  })

  it('GETリクエストでフォーム送信が正しく動作すること', async () => {
    const action = '/api/test';
    const method = 'GET';
    const paramName = 'param1';
    const paramValue = 'value1';
    const submitText = '送信';
    const expectedData = { [paramName]: paramValue };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve('{"result": "success"}')
    })

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')
    
    // 非同期処理の完了を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    // イベントが発火されたことを確認
    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })

  it('POSTリクエストでフォーム送信が正しく動作すること', async () => {
    const action = '/api/test';
    const method = 'POST';
    const paramName = 'param1';
    const paramValue = 'value1';
    const submitText = '送信';
    const expectedData = { [paramName]: paramValue };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve('{"result": "success"}')
    })

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')
    
    // 非同期処理の完了を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })

  it('リクエストエラーが正しく処理されること', async () => {
    const action = '/api/test';
    const method = 'GET';
    const paramName = 'param1';
    const paramValue = 'value1';
    const submitText = '送信';
    const expectedData = { [paramName]: paramValue };
    const error = new Error('Network error');
    
    fetch.mockRejectedValueOnce(error)

    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `<input name="${paramName}" value="${paramValue}"><input type="submit" value="${submitText}">`
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')

    // 非同期処理を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })

  it('チェックボックスとラジオボタンが正しく処理されること', async () => {
    const action = '/test';
    const method = 'GET';
    const checkbox1Name = 'checkbox1';
    const checkbox1Value = 'cb1';
    const checkbox2Name = 'checkbox2';
    const checkbox2Value = 'cb2';
    const radio1Name = 'radio1';
    const radio1Value1 = 'r1';
    const radio1Value2 = 'r2';
    const expectedData = {
      [checkbox1Name]: checkbox1Value,
      [radio1Name]: radio1Value1
    };
    
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `
          <input type="checkbox" name="${checkbox1Name}" value="${checkbox1Value}" checked>
          <input type="checkbox" name="${checkbox2Name}" value="${checkbox2Value}">
          <input type="radio" name="${radio1Name}" value="${radio1Value1}" checked>
          <input type="radio" name="${radio1Name}" value="${radio1Value2}">
        `
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')
    
    // 非同期処理の完了を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })

  it('無効化された入力要素が無視されること', async () => {
    const action = '/test';
    const method = 'GET';
    const enabledName = 'enabled';
    const enabledValue = 'enabled-value';
    const disabledName = 'disabled';
    const disabledValue = 'disabled-value';
    const expectedData = {
      [enabledName]: enabledValue
    };
    
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method
      },
      slots: {
        default: `
          <input name="${enabledName}" value="${enabledValue}">
          <input name="${disabledName}" value="${disabledValue}" disabled>
        `
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')
    
    // 非同期処理の完了を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })

  it('uriEncodeプロパティが正しく動作すること', async () => {
    const action = '/test';
    const method = 'GET';
    const uriEncode = true;
    const inputName = 'test param';
    const inputValue = 'test value';
    const encodedName = 'test%20param';
    const encodedValue = 'test%20value';
    const expectedData = {
      [encodedName]: encodedValue
    };
    
    const wrapper = mount(VAjaxForm, {
      props: {
        action: action,
        method: method,
        uriEncode: uriEncode
      },
      slots: {
        default: `<input name="${inputName}" value="${inputValue}">`
      }
    })

    // フォーム送信をトリガー
    await wrapper.find('form').trigger('submit.prevent')
    
    // 非同期処理の完了を待機
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([expectedData])
  })
})
