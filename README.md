# v-ajax-form
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![npm version](https://badge.fury.io/js/v-ajax-form.svg)](https://badge.fury.io/js/v-ajax-form)

**[日本語版はこちら](README.md)**

## Introduction

v-ajax-form is a custom element of Vue.js. Asynchronous communication processing is realized by replacing the form tag.


Responses from the server can be processed by setting a callback method in the dispatched form tag event.


If you understand HTML and the minimum Vue.js, we aimed to use it at zero learning cost.

## Background
It is premised on using ajax that uses asynchronous communication processing that updates only a part of a page, and it is not enough to update information that relies only on conventional page transitions in the requirements required for Web services in recent years. Requirements are now taken for granted.


However, the Form tag, which is the standard HTML feature that sends input values ​​to the server most easily, involves page transitions when communicating with the server.


As a result of examining the implementation method to improve the efficiency of asynchronous communication processing while maintaining maintainability, I thought it was optimal to implement and use Vue custom elements that realize asynchronous communication processing with the same interface as the Form tag .


This Vue.js plug-in was implemented and published to realize the idea and make it widely used as a general-purpose one.

## Install

Three methods are available. 

### Download
Download the latest version of the master branch.

### CDN
Paste the following code inside the head tag.
``` html
<script src='https://cdn.jsdelivr.net/gh/hosokawat/v-ajax-form@v1.0.5/v-ajax-form.min.js'></script>
```

### npm

``` bash
npm install v-ajax-form
```


## Sample code

Information acquisition page for books.


[jsfiddle](https://jsfiddle.net/hosokawat/tfhn2cp3/)


[Bibliographic Information Acquisition API](https://openbd.jp) by The openBD project's  was used as the back end.


I would like to take this moment to say thank you.

## How to use

The HTML code that sends the value of param1 to the ***/request*** with the post method can be written as follows:

``` html
<form action=‘/request’ method=‘post’>
    <input name=‘param1’ value=parameter1>
    <input type=‘submit’ value=‘send’>
</form>
```
Forms with the above code are accompanied by screen transitions during communication.


And using v-ajax-form, you can write a form that performs asynchronous communication under the same conditions as follows.

``` html
<v-ajax-form action=‘/request’ method=‘post’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```

The above code does not include the code for processing the server response of asynchronous communication processing.


The callback function for processing the response from the server can be registered as an event listener.


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

class, ID, or any attribute can be set.

``` html
<v-ajax-form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value=‘パラメータ1’>
    <input type=‘submit’ value=‘送信’>
</v-ajax-form>
```

Everything is copied to the form tag that will be replaced by Vue rendering.

## Specification

### Element
v-ajax-form

### property

|Attribute name|Type|Explanation|
|-------|----------|----------|
|action|String|Request destination of asynchronous communication|
|method|String|HTTP method for asynchronous communication|
|uri-encode|Boolean|Encode request parameter key and value with encodeURIComponent|
|*(others)|String|copied to form tag|

### Event
The v-ajax-form tag is replaced with the form tag, and the form submit listener is replaced with asynchronous processing.


As the asynchronous communication process progresses, the following events are dispatched in order.

[start] -> [receive or fail] -> [done]

|Event name|Timing|Parameters|
|-------|----------|----------|
|start|Immediately before communication|Request parameters|
|receive|After successful communication|Request parameter & response request information|
|fail|After communication failure|Request parameter & response request information|
|done|After communication processing is completed|Request parameters|


### Rendering specification
v-ajax-form is replaced with the form tag, and all attributes are copied to the form tag.

**Before**
``` html
<v-ajax-form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value='parameter1'>
    <input type=‘submit’ value='send'>
</v-ajax-form>
```
**After**
``` html
<form action=‘/request’ method=‘post’ id=‘id1’ class=‘class1’ prop1=‘prop1’>
    <input name=‘param1’ value='parameter1'>
    <input type=‘submit’ value='send'>
</form>
```
