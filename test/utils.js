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

    Lab.it('should return an empty array if not files were found.', (done) => {

        const files = Utils.loadFilesFromDir('*.js', { cwd: '/' });

        Lab.expect(files).to.exist();
        Lab.expect(files).to.be.an.array();
        Lab.expect(files).to.have.length(0);

        return done();
    });

    Lab.it('should fail if an invalid cwd option were passed.', (done) => {

        Lab.expect(() => Utils.loadFilesFromDir('*.js', { cwd: 123 })).to.throw(Error);

        return done();
    });

    Lab.it('should fail if cwd is not a directory.', (done) => {

        Lab.expect(() => {

            Utils.loadFilesFromDir('*.js', {
                cwd: `${__dirname}/artifacts/routes/single_route.js`
            });
        }).to.throw(Error);

        return done();
    });
});
