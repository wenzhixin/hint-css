# hint-css

hint.css by jQuery

## Example

* https://live.bootstrap-table.com/code/wenzhixin/1362
* https://live.bootstrap-table.com/code/wenzhixin/1361

## Install

### NPM or YARN

```bash
npm install hint-css.js
# or
yarn add hint-css.js
```

### CDN

```
<link rel="stylesheet" href="https://unpkg.com/hint-css.js@1.1.0/src/hint-css.css">
<script src="https://unpkg.com/hint-css.js@1.1.0/src/hint-css.js"></script>
```

## How to use

```
<!-- hint--bottom by default -->
<button data-hint="Tooltips">bottom</button>
<button class="hint--top" data-hint="Tooltips">top</button>
<button class="hint--left" data-hint="Tooltips">left</button>
<button class="hint--right" data-hint="Tooltips">right</button>
```

## Class

* hint--bottom
* hint--top
* hint-left
* hint-right

## Options

```js
$.hint.defaults = {
  className: null,
  delayIn: 500,
  fade: false,
  fallback: '',
  gravity: 'n',
  html: false, //data-hint-html="true|false"
  live: false,
  offset: 0,
  opacity: 0.8,
  title: 'title',
  textAlign: 'center',  //data-hint-align="center"
  maxWidth: 0  // data-hint-max-width
}
```

## Why

[hint.css](https://github.com/chinchang/hint.css) is a CSS only tooltip library for your lovely websites.

It is very easy to use but there are some problems when I am using in [bootstrap-table](https://github.com/wenzhixin/bootstrap-table).

![1](https://cloud.githubusercontent.com/assets/2117018/14975830/53603806-1138-11e6-869a-a9c3233367d0.png)

I want to solve this problem but I don't have a good idea. So I create this jQuery plugin.

![2](https://cloud.githubusercontent.com/assets/2117018/14975833/54a6bc6c-1138-11e6-9826-cb81bdfc11a2.png)

---

Thanks for hint.css and tipsy.
