const glob = require('glob');
const joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const schemas = require('./schemas');

const globOptions = joi.object().keys({
  cwd: joi.string().required()
}).unknown();

const loadFilesFromDir = exports.loadFilesFromDir = (pattern, options, done) => {
  async.auto({
    glob: callback => joi.validate(options, globOptions, callback),
    stats: ['glob', (stack, callback) => fs.stat(options.cwd, callback)],
    directory: ['stats', (stack, callback) => {
      if (!stack.stats.isDirectory()) {
        return callback(new Error('options.cwd: must be a directory.'));
      }

      return callback(null, true);
    }],
    load: ['directory', (stack, callback) => glob(pattern, options, callback)],
    files: ['load', (stack, callback) => {
      const files = _.map(stack.load, file => `${options.cwd}/${file}`);

      return callback(null, files);
    }]
  }, done);
};

exports.registerMethods = (options, server, done) => {
  async.auto({
    schema: callback => joi.validate(options, schemas.methods, callback),
    load: ['schema', (stack, callback) => {
      return loadFilesFromDir(stack.schema.pattern, stack.schema, callback);
    }],
    methods: ['load', (stack, callback) => {
      return async.map(stack.load.files, (file, next) => {
        const methods = _.map(require(file), (method, methodName) => {
          const fileName = path.basename(file).replace(path.extname(file), '');
          const prefix = (method.prefix) ? method.prefix : fileName;
          const name = (method.name) ? method.name : methodName;

          return {
            name: `${_.camelCase(prefix)}.${_.camelCase(name)}`,
            method: method.method,
            options: method.options
          };
        });

        return next(null, methods);
      }, callback);
    }],
    register: ['methods', (stack, callback) => {
      return async.map(stack.methods, (method, next) => {
        server.method(method);
        return next(null, `[method:${method.name}]:registered.`);
      }, callback);
    }]
  }, done);
};
