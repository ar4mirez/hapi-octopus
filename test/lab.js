const code = require('code');
const Lab = require('lab');
const pkg = require('../package.json');

const lab = exports.lab = Lab.script();

exports.describe = lab.describe;
exports.it = lab.it;
exports.before = lab.before;
exports.beforeEach = lab.beforeEach;
exports.after = lab.after;
exports.afterEach = lab.afterEach;

exports.expect = code.expect;

exports.pkg = pkg;
