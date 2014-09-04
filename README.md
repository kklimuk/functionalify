# functools

Functional programming tools with close integration with JavaScript.

## Sample Usage
```js
var functools = require("./index");
```

## Motivating Examples

### Finding the value of a query string param
``` js
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

### Grouping values together
``` js
const evensAndOdds = (10).times.groupBy(function(val) {
    return val % 2 ? "odd" : "even";
}); // { even: [ 0, 2, 4, 6, 8 ], odd: [ 1, 3, 5, 7, 9 ] }
```