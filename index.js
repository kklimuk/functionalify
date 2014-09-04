require('./app/array');
require('./app/object');
require('./app/string');
require('./app/number');

module.exports = {
    common: require('./app/common'),
    Maybe: require('./app/maybe')
};