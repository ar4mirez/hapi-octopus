const glob = require('glob');
const joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const schemas = require('./schemas');

const internals = {};

const globOptions = joi.object().keys({
  cwd: joi.string().required()
}).unknown();

exports.loadFilesFromDir = async (pattern, options) => {
  joi.validate(options, globOptions);
  const stats = fs.statSync(options.cwd);
  if (!stats.isDirectory()) {
    throw Error('options.cwd: must be a directory.');
  }
  const stack = glob.sync(pattern, options);
  const files = _.map(stack, file => `${options.cwd}/${file}`);

  return {files};
};
internals.loadFilesFromDir = exports.loadFilesFromDir;

exports.extractObjectsFromFiles = async files => {
  let allObjects = [];

  files.forEach(file => {
    const fileName = path.basename(file).replace(path.extname(file), '');
    const objects = _.map(require(file), (val, key) => {
      const prefix = (val.prefix) ? val.prefix : fileName;
      const name = (val.name) ? val.name : key;

      return _.assign(val, {
        prefix: _.camelCase(prefix),
        name: _.camelCase(name)
      });
    });

    allObjects.push(objects);
  });

  return allObjects;
};
internals.extractObjectsFromFiles = exports.extractObjectsFromFiles;

internals.apply = {
  methods: (server, obj) => {
    server.method(`${obj.prefix}.${obj.name}`, obj.method, obj.options);
  },
  handlers: (server, obj) => {
    server.decorate('handler', _.camelCase(`${obj.prefix}_${obj.name}`), obj.method);
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

exports.register = async (type, glob, server) => {
  const globData = joi.validate(glob, schemas.glob);
  const loadData = await internals.loadFilesFromDir(globData.value.pattern, globData.value);
  const objects = await internals.extractObjectsFromFiles(loadData.files);

  let validatedData = [];
  _.flattenDeep(objects).forEach(obj => {
    validatedData.push(joi.validate(obj, schemas[type]));
  });

  validatedData.forEach(obj => {
    internals.apply[type](server, obj.value);
  });
};
