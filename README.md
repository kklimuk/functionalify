# functionalify

Functional programming tools with close integration with JavaScript.

## Installation
```sh
npm install functionalify
```

## Sample Usage
```js
var functionalify = require("functionalify");
```

## Motivation
JavaScript provides us with first-class functions to build great functional programs.
Unfortunately, it also doesn't provide us with either the data structures or the methods to do so.
functionalify fills in these holes by:

1. Adding immutable, monadic, and other operations and useful to existing data structures (arrays and objects).
    * Yes, modifying prototypes is considered a no-no. But now you can use existing APIs in a functional way.
2. Contributing new, but necessary, data structures (maps, sets, and maybes (options)).
    * Yes, ES6 does define maps and sets. Ours are immutable.
3. Making all of the above work with the common frameworks/libraries of today.
    * Yes, we realize that some libraries can overwrite our methods. We'll let them.

Below are some motivating examples:

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
## API
### `Array`
#### Class Methods
- `from(array:Array-Like)`
    - returns array
```js
Array.from(document.querySelectorAll("p")) // Array[HTMLElement]
```