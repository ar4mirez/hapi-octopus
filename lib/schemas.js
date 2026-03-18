'use strict';

const Joi = require('joi');

exports.glob = Joi.object({
    cwd: Joi.string()
        .default(process.cwd())
        .label('directory')
        .description('methods directory'),
    pattern: Joi.string().default('*.js'),
    ignore: Joi.string()
});

exports.methods = Joi.object({
    name: Joi.string(),
    method: Joi.func(),
    options: Joi.object(),
    prefix: Joi.string()
}).required().and('method', 'name');

exports.handlers = Joi.object({
    name: Joi.string(),
    method: Joi.func(),
    options: Joi.object(),
    prefix: Joi.string()
}).required().and('method', 'name');

exports.routes = Joi.object({
    routes: Joi.alternatives(Joi.array(), Joi.object()),
    method: Joi.func(),
    options: Joi.object(),
    prefix: Joi.string(),
    name: Joi.string()
}).or('method', 'routes');

exports.decorators = Joi.object({
    decorate: Joi.string().valid('request', 'toolkit', 'server'),
    name: Joi.string(),
    method: Joi.any(),
    prefix: Joi.string(),
    options: Joi.object()
}).required().and('decorate', 'name', 'method');
