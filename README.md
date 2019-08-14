# v-ajax-form
## はじめに

v-ajax-formは、Vue.jsのカスタムエレメントです。
formタグを置き換えることで非同期通信処理を実現します。
サーバからの応答はディスパッチされるformタグのイベントに、
コールバックメソッドを設定することで処理することができます。
HTMLと最低限のVue.jsを理解していれば、学習コストゼロで使えることを目指しました。

## 背景
近年のWebサービスに求められる要件では
従来のページ遷移のみに頼った情報更新だけでは不十分であり、
ページの一部のみの更新を行う非同期通信処理を使ったajaxを活用することを前提とする要件が当たり前のものとして求められるようになりました。

しかし、HTMLが標準で備えていて最も手軽に入力値をサーバに送る機能であるFormタグはサーバとの通信の際にページ遷移を伴うものとなっています。

非同期通信処理を保守性を維持した上で効率化する実装方法を検討した結果、
Formタグと同じインターフェースで非同期通信処理を実現するVueのカスタムエレメントを実装して使うことが最適だと考えました。

そのアイデアを実現し汎用的なものとして広く活用するために、このVue.jsプラグインを実装して公開しました。

## インストール

2つの方法を用意しています。
通信に必要な実装はaxiosに移譲しています(餅は餅屋ということで)。合わせてロードしてください。

### ダウンロード
masterブランチの最新版をダウンロードしてください。


[axios](https://github.com/axios/axios)もダウンロードしてください。


### CDN
headタグ内に次のコードを貼り付けてください。
``` html
<script src='https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'></script>
<script src='https://cdn.jsdelivr.net/gh/hosokawat/v-ajax-form@master/v-ajax-form.js'></script>
```

## サンプルコード

本の情報取得ページです。

[jsfiddle](https://jsfiddle.net/hosokawat/tfhn2cp3/)

株式会社カーリル様(https://calil.jp)が提供してい
openBDプロジェクト「書誌情報の取得API」(https://openbd.jp)をバックエンドに利用しました。
この場を借りてお礼申し上げます。ありがとうございます。

## 使い方

“/request”に対してpostメソッドでparam1の値を送信するHTMLコードは次のように記述できます。

``` html
<form action=‘/request’ method=‘post’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</form>
```

v-ajax-formを利用すると、同様の条件で非同期通信を行うHTMLコードは次のように記述できます。

``` html
<v-ajax-form action=‘/request’ method=‘post’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```

上記コードでは非同期通信処理のサーバ応答を処理するコードが含まれていません。
サーバからの応答を処理するためのコールバック関数はイベントリスナーとして登録することができます。

``` html
<v-ajax-form action=‘/request’ method=‘post’ @receive='receive'>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```

``` javascript

methods: {
    receive: function(res){
        // print out server response
        console.log(res);
    }
}
```

クラスやID、もしくは任意の属性を設定することも可能です。
``` html
<v-ajax-form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```

全てVueのレンダリングでリプレースされるformタグにコピーされます。

## 仕様

### エレメント名

v-ajax-form

### プロパティ

|属性名|解説|
|-------|----------|
|action|非同期通信のリクエスト先|
|method|非同期通信のHTTPメソッド|
|*|formタグにコピーされます|

### イベント
v-ajax-formタグはformタグにリプレースされ、formのsubmitのリスナーを非同期処理に置き換えます。
非同期通信処理の進捗に伴い、次のイベントが順番にディスパッチされます。

[start] -> [receive または fail] -> [done]

|イベント名|タイミング|パラメータ|
|-------|----------|----------|
|start|通信の直前|リクエストパラメータ|
|receive|通信成功後|リクエストパラメータ&レスポンス・リクエスト情報|
|fail|通信失敗後|リクエストパラメータ&レスポンス・リクエスト情報|
|done|通信処理の完了後|リクエストパラメータ|


### レンダリング仕様
v-ajax-formはformタグにリプレースされ、全ての属性はformタグにコピーされます。

**Before**
``` html
<v-ajax-form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```
**After**
``` html
<form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</form>
```
