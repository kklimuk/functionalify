# functools

Functional programming tools with close integration with JavaScript.

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
