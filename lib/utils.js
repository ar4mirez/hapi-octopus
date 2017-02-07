'use strict';

const Glob = require('glob');
const Hoek = require('hoek');
const Joi = require('joi');
const _ = require('lodash');

const internals = {
    options: {}
};

exports.loadFilesFromDir = (pattern, options) => {

    const validation = Joi.validate(options, Joi.object().keys({
        cwd: Joi.string()
    }));

    if (validation.error) {
        throw new Error(validation.error.annotate());
    }

    const files = Glob.sync(pattern, Hoek.applyToDefaults(internals.options, options));
    return _.map(files, (file) => (`${options.cwd}/${file}`));
};
