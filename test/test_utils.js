'use strict';

const lab = require('./lab');
const utils = require('../lib/utils');

const describe = lab.describe;
const it = lab.it;
const expect = lab.expect;
const pkg = lab.pkg;

describe(`${pkg.name}:utils`, () => {
  describe('utils:#loadFilesFromDir', () => {
    it('should #loadFilesFromDir function exist.', done => {
      expect(utils.loadFilesFromDir).to.exist();
      expect(utils.loadFilesFromDir).to.be.a.function();

      return done();
    });

    it('should load files from a folder.', done => {
      const options = {cwd: `${__dirname}/artifacts/routes`};
      utils.loadFilesFromDir('*.js', options, (error, data) => {
        expect(data.files).to.exist();
        expect(data.files).to.be.an.array();
        expect(data.files).to.have.length(2);

        return done();
      });
    });

    it('should return an empty array if not files were found.', done => {
      utils.loadFilesFromDir('*.js', {cwd: '/'}, (error, data) => {
        expect(data.files).to.exist();
        expect(data.files).to.be.an.array();
        expect(data.files).to.have.length(0);

        return done();
      });
    });

    it('should fail if an invalid cwd option were passed.', done => {
      utils.loadFilesFromDir('*.js', {cwd: 123}, error => {
        expect(error).to.exist();
        expect(error).to.be.an.instanceof(Error);

        return done();
      });
    });

    it('should fail if cwd is not a directory.', done => {
      const options = {cwd: `${__dirname}/artifacts/routes/single_route.js`};

      utils.loadFilesFromDir('*.js', options, error => {
        expect(error).to.exist();
        expect(error).to.be.an.instanceof(Error);

        return done();
      });
    });
  });
});
