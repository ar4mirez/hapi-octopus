'use strict';

const Glob = require('glob');
const Joi = require('joi');
const _ = require('lodash');
const Fs = require('fs');

const internals = {
    options: Joi.object().keys({
        cwd: Joi.string().required()
    })
};

exports.loadFilesFromDir = (pattern, options) => {

    const validation = Joi.validate(options, internals.options);

    if (validation.error) {
        throw new Error(validation.error.annotate());
    }

    if (!Fs.statSync(options.cwd).isDirectory()) {
        throw new Error('options.cwd: must be a valid directory.');
    }

    const files = Glob.sync(pattern, options);

    return _.map(files, (file) => (`${options.cwd}/${file}`));
};
