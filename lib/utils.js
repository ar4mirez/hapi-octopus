'use strict';

const { globSync } = require('glob');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const schemas = require('./schemas');

const internals = {};

const globOptions = Joi.object({
    cwd: Joi.string().required()
}).unknown();

const toCamelCase = (str) => str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

exports.loadFilesFromDir = async (pattern, options) => {

    const { error } = globOptions.validate(options);
    if (error) {
        throw error;
    }

    const stats = fs.statSync(options.cwd);
    if (!stats.isDirectory()) {
        throw new Error('options.cwd: must be a directory.');
    }

    const stack = globSync(pattern, options);
    const files = stack.map((file) => `${options.cwd}/${file}`);

    return { files };
};
internals.loadFilesFromDir = exports.loadFilesFromDir;

exports.extractObjectsFromFiles = async (files) => {

    const allObjects = [];

    for (const file of files) {
        const fileName = path.basename(file).replace(path.extname(file), '');
        const exports_ = require(file);

        const objects = Object.entries(exports_).map(([key, val]) => {
            const prefix = val.prefix ? val.prefix : fileName;
            const name = val.name ? val.name : key;

            return Object.assign({}, val, {
                prefix: toCamelCase(prefix),
                name: toCamelCase(name)
            });
        });

        allObjects.push(objects);
    }

    return allObjects;
};
internals.extractObjectsFromFiles = exports.extractObjectsFromFiles;

internals.apply = {
    methods: (server, obj) => {

        server.method(`${obj.prefix}.${obj.name}`, obj.method, obj.options);
    },
    handlers: (server, obj) => {

        server.decorate('handler', toCamelCase(`${obj.prefix}_${obj.name}`), obj.method);
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

exports.register = async (type, globConfig, server) => {

    const { error, value: globData } = schemas.glob.validate(globConfig);
    if (error) {
        throw error;
    }

    const loadData = await internals.loadFilesFromDir(globData.pattern, globData);
    const objects = await internals.extractObjectsFromFiles(loadData.files);

    const flat = objects.flat();
    for (const obj of flat) {
        const { error: valErr, value } = schemas[type].validate(obj);
        if (valErr) {
            throw valErr;
        }

        internals.apply[type](server, value);
    }
};
