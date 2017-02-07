'use strict';

const internals = {};

exports.register = (server, options, next) => {

    return next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
