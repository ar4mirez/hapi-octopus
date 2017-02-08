const async = require('async');
const utils = require('./utils');

exports.register = (server, options, next) => {
  async.auto({
    methods: callback => utils.registerMethods(options.methods, server, callback)
    // preHandlers: callback => {},
    // handlers: ['preHandlers', (data, callback) => {}],
    // routes: ['handlers', (data, callback) => {}]
  }, next);
};

exports.register.attributes = {
  pkg: require('../package.json')
};
