require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');
require('./app/hashmap');

var functionalify = {
    common: require('./app/common'),
    Maybe: require('./app/maybe'),
    Map: require('./app/hashmap'),
    Set: require('./app/hashset')
};

if (typeof window !== 'undefined') {
    window.functionalify = window._ = require('./app/common');
    window.Map = functionalify.Map;
    window.Set = functionalify.Set;
    window.Maybe = functionalify.Maybe;
}

module.exports = functionalify;