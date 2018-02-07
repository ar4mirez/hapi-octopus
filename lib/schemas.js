const joi = require('joi');

exports.glob = joi.object().keys({
  cwd: joi.string()
    .default(process.cwd())
    .label('directory')
    .description('methods directory'),
  pattern: joi.string().default('*.js'),
  ignore: joi.string()
});

exports.methods = joi.object().keys({
  name: joi.string(),
  method: joi.func(),
  options: joi.object(),
  prefix: joi.string()
}).requiredKeys(['method', 'name']);

exports.handlers = joi.object().keys({
  name: joi.string(),
  method: joi.func(),
  options: joi.object(),
  prefix: joi.string()
}).requiredKeys(['method', 'name']);

exports.routes = joi.object().keys({
  routes: joi.alternatives(joi.array(), joi.object()),
  method: joi.func(),
  options: joi.object(),
  prefix: joi.string(),
  name: joi.string()
}).or(['method', 'routes']);

exports.decorators = joi.object().keys({
  decorate: joi.string().valid(['request', 'reply', 'server']),
  name: joi.string(),
  method: joi.any(),
  prefix: joi.string(),
  options: joi.object()
}).requiredKeys(['decorate', 'name', 'method']);
