require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');
require('./app/hashmap');

var functionalify = {
    common: require('./app/common'),
    Maybe: require('./app/maybe'),
    Map: require('./app/hashmap')
};

if (typeof window !== 'undefined') {
    window.functionalify = window._ = functionalify;
}

module.exports = functionalify;