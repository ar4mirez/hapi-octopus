const joi = require('joi');

exports.routes = joi.object().keys({
  cwd: joi.string().default(process.cwd()),
  pattern: joi.string().default('*.js'),
  ignore: joi.string()
});

exports.handlers = joi.object().keys({
  cwd: joi.string().default(process.cwd()),
  pattern: joi.string().default('*.js'),
  ignore: joi.string()
});

exports.preHandlers = joi.object().keys({
  cwd: joi.string().default(process.cwd()),
  pattern: joi.string().default('*.js'),
  ignore: joi.string()
});

exports.methods = joi.object().keys({
  cwd: joi.string()
      .default(process.cwd())
      .label('directory')
      .description('methods directory'),
  pattern: joi.string().default('*.js'),
  ignore: joi.string()
});
