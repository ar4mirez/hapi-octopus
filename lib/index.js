const hoek = require('hoek');
const utils = require('./utils');
const Package = require('../package');

const internals = {
  defaultsOptions: {
    methods: {},
    handlers: {},
    routes: {},
    decorators: {}
  }
};

exports.register = async (server, options) => {
  const opts = hoek.applyToDefaults(internals.defaultsOptions, options);
  await utils.register('methods', opts.methods, server);
  await utils.register('handlers', opts.handlers, server);
  await utils.register('routes', opts.routes, server);
  await utils.register('decorators', opts.decorators, server);
};

exports.name = Package.name;
exports.version = Package.version;
