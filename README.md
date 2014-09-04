# functools

Functional programming tools with close integration with JavaScript.

[![build status](https://secure.travis-ci.org/kklimuk/functools.png)](http://travis-ci.org/kklimuk/functools)

## Installation

This module is installed via npm:

``` bash
$ npm install functools
```

## Motivating Examples

### Finding the value of a query string param
``` js
var functools = require("./index");
function getParamValue(search, param) {
    return search.slice(1).split("&")
        .find(function(component) { return component.startswith(param + "=") })
        .flatMap(function(item) { return item.split("=").last })
        .getOrElse("");
}

const search = "?foo=bar&bar=baz&taco=belle";
getParamValue(search, "foo"); // "bar"
getParamValue(search, "freedom"); // ""
```
