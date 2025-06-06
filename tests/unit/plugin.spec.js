import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import VAjaxFormPlugin from '../../src/main.js'

describe('VAjaxFormPlugin', () => {
  it('プラグインがinstallメソッドを持つこと', () => {
    expect(typeof VAjaxFormPlugin.install).toBe('function')
  })

  it('Vue アプリケーションにコンポーネントが正しく登録されること', () => {
    const app = createApp({})
    const componentSpy = vi.fn()
    
    // app.componentをモック
    app.component = componentSpy
    
    // プラグインをインストール
    VAjaxFormPlugin.install(app)
    
    // コンポーネントが登録されたかチェック
    expect(componentSpy).toHaveBeenCalledWith('v-ajax-form', expect.any(Object))
  })

  it('プラグインが正しくエクスポートされること', () => {
    expect(VAjaxFormPlugin).toBeDefined()
    expect(typeof VAjaxFormPlugin).toBe('object')
    expect(VAjaxFormPlugin.install).toBeDefined()
  })
})
