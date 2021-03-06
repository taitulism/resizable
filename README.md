[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/resizable.svg?branch=develop)](https://travis-ci.org/taitulism/resizable)

resizable-elm
=============
Makes elements resizable. Vanilla style.

```js
const resizable = require('resizable-elm');

const myElm = document.getElementById('target');

resizable(myElm, {options});
```

## Options

* **`classname`** - String. A replacement for the `resizable` classname.
* `minWidth` - Number. Limits the element minimum width.
* `minHeight` - Number. Limits the element minimum height.
* `gripSize` - Number. Sets the resizing grips size.
* `direction` - String. Restricts resizing toward a single direction. Could be one of:
    * `'top'`
    * `'right'`
    * `'bottom'`
    * `'left'`

## API
Calling the `resizable()` function returns a `Resizable` instance: 
```js
const r = resizable(elm);
```
It has the following methods:

### **.enable() / .disable()**
Toggle resizability. When disabled, the main element gets a `'resize-disabled'` classname.

### **.on(eventName, callback)**
Listen to drag and drop events:
* **`'resize-start'`** - resizing started, on mouse down.
* **`'resizing'`** - moving around, on mouse move (with mouse down)
* **`'resize-end'`** - resizing stopped, on mouse up.

Callbacks' first argument is the event object.

The `resizing` event has a second argument: a `size` object, `{width, height}`.

The `resize-end` event has a second argument: the new bounding client rect of the target element (i.e. `elm.getBoundingClientRect()`)

**Event Aliases**  
For extra convenience, anything that contains `start`, `stop`/`end` or `ing` will match its respective event.

### **.showGrips() / .hideGrips()**
Toggle grips opacity. You will still need to style them in order to see them.  
All grips have a `resize-grip` classname.

### **.destroy()**
Kills the `Resizable` instance for good, unbinds events, releases element references.

## ClassNames
For styling, the main element will be given the following classes:
* `'resizable'` - from initialization until destruction.
* `'resizing'` - on mouse down on a resize grip, until mouse up.

&nbsp;

>### Position:
>On initialization, the target element will be placed inside the `<body>` element and will be given an inline style of `position: absolute`.
