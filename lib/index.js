const _ = require('lodash');
const async = require('async');
const hoek = require('hoek');
const utils = require('./utils');

const internals = {
  defaultsOptions: {
    methods: {},
    handlers: {},
    routes: {},
    decorators: {}
  }
};

exports.register = (server, options, next) => {
  const opts = hoek.applyToDefaults(internals.defaultsOptions, options);

  async.auto({
    methods: callback => {
      return utils.register('methods', opts.methods, server, callback);
    },
    handlers: ['methods', (data, callback) => {
      return utils.register('handlers', opts.handlers, server, callback);
    }],
    routes: ['handlers', (data, callback) => {
      return utils.register('routes', opts.routes, server, callback);
    }],
    decorators: ['methods', 'handlers', (stack, callback) => {
      return utils.register('decorators', opts.decorators, server, callback);
    }]
  }, next);
};

exports.register.attributes = {
  pkg: require('../package.json')
};
