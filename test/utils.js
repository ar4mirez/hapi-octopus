'use strict';

const Lab = require('./lab');
const Utils = require('../lib/utils');

Lab.describe(`${Lab.pkg.name}:utils`, () => {

    Lab.it('should #loadFilesFromDir function exist.', (done) => {

        Lab.expect(Utils.loadFilesFromDir).to.exist();
        Lab.expect(Utils.loadFilesFromDir).to.be.a.function();

        return done();
    });

    Lab.it('should load files from a folder.', (done) => {

        const files = Utils.loadFilesFromDir('*.js', {
            cwd: `${__dirname}/artifacts/routes`
        });

        Lab.expect(files).to.exist();
        Lab.expect(files).to.be.an.array();
        Lab.expect(files).to.have.length(2);

        return done();
    });
});
