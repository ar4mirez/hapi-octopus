'use strict';

const utils = require('./utils');
const Pkg = require('../package.json');

const internals = {
    defaultOptions: {
        methods: {},
        handlers: {},
        routes: {},
        decorators: {}
    }
};

exports.plugin = {
    pkg: Pkg,
    register: async (server, options) => {

        const opts = Object.assign({}, internals.defaultOptions, options);

        if (opts.methods && opts.methods.cwd) {
            await utils.register('methods', opts.methods, server);
        }

        if (opts.handlers && opts.handlers.cwd) {
            await utils.register('handlers', opts.handlers, server);
        }

        if (opts.routes && opts.routes.cwd) {
            await utils.register('routes', opts.routes, server);
        }

        if (opts.decorators && opts.decorators.cwd) {
            await utils.register('decorators', opts.decorators, server);
        }
    }
};
