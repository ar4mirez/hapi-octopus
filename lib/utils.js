'use strict';

const Glob = require('glob');
const Hoek = require('hoek');
const _ = require('lodash');

const internals = {
    options: {
        cwd: process.cwd()
    }
};

exports.loadFilesFromDir = (pattern, options) => {

    const files = Glob.sync(pattern, Hoek.applyToDefaults(internals.options, options));
    return _.map(files, (file) => (`${options.cwd}/${file}`));
};
