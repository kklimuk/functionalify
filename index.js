require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');

var functionalify = {
    common: require('./app/common'),
    Maybe: require('./app/maybe')
};

if (typeof window !== 'undefined') {
    window.functionalify = functionalify;
}

module.exports = functionalify;