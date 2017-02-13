const glob = require('glob');
const joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const schemas = require('./schemas');

const internals = {};

const globOptions = joi.object().keys({
  cwd: joi.string().required()
}).unknown();

internals.loadFilesFromDir = exports.loadFilesFromDir = (pattern, options, done) => {
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

internals.extractObjectsFromFiles = exports.extractObjectsFromFiles = (files, done) => {
  async.map(files, (file, next) => {
    const fileName = path.basename(file).replace(path.extname(file), '');
    const objects = _.map(require(file), (val, key) => {
      const prefix = (val.prefix) ? val.prefix : fileName;
      const name = (val.name) ? val.name : key;

      return _.assign(val, {
        prefix: _.camelCase(prefix),
        name: _.camelCase(name)
      });
    });

    return next(null, objects);
  }, done);
};

internals.apply = {
  methods: (server, obj) => {
    server.method(`${obj.prefix}.${obj.name}`, obj.method, obj.options);
  },
  handlers: (server, obj) => {
    server.handler(_.camelCase(`${obj.prefix}_${obj.name}`), obj.method);
  },
  routes: (server, obj) => {
    if (obj.method) {
      obj.method(server, obj.options);
    }
    if (obj.routes) {
      server.route(obj.routes);
    }
  },
  decorators: (server, obj) => {
    server.decorate(obj.decorate, obj.name, obj.method, obj.options);
  }
};

exports.register = (type, glob, server, done) => {
  async.auto({
    glob: callback => joi.validate(glob, schemas.glob, callback),
    load: ['glob', (data, callback) => {
      const pattern = data.glob.pattern;
      const globOptions = data.glob;

      return internals.loadFilesFromDir(pattern, globOptions, callback);
    }],
    objects: ['load', (data, callback) => {
      const files = data.load.files;

      return internals.extractObjectsFromFiles(files, callback);
    }],
    validate: ['objects', (data, callback) => {
      const objects = data.objects;

      return async.map(_.flattenDeep(objects), (obj, next) => {
        return joi.validate(obj, schemas[type], next);
      }, callback);
    }],
    register: ['validate', (data, callback) => {
      const objects = data.validate;

      return async.map(objects, (obj, next) => {
        internals.apply[type](server, obj);

        return next();
      }, callback);
    }]
  }, done);
};
