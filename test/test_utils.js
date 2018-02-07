'use strict';

const lab = require('./lab');
const utils = require('../lib/utils');

const describe = lab.describe;
const it = lab.it;
const expect = lab.expect;
const pkg = lab.pkg;

describe(`${pkg.name}:utils`, async () => {
  describe('utils:#loadFilesFromDir', async () => {
    it('should #loadFilesFromDir function exist.', async () => {
      expect(utils.loadFilesFromDir).to.exist();
      expect(utils.loadFilesFromDir).to.be.a.function();
    });

    it('should load files from a folder.', async () => {
      const options = {cwd: `${__dirname}/artifacts/routes`};
      const data = await utils.loadFilesFromDir('*.js', options);
      expect(data.files).to.exist();
      expect(data.files).to.be.an.array();
      expect(data.files).to.have.length(2);
    });

    it('should return an empty array if not files were found.', async () => {
      const data = await utils.loadFilesFromDir('*.js', {cwd: '/'});
      expect(data.files).to.exist();
      expect(data.files).to.be.an.array();
      expect(data.files).to.have.length(0);
    });

    it('should fail if an invalid cwd option were passed.', async () => {
      let error;

      try {
        await utils.loadFilesFromDir('*.js', {cwd: 123});
      } catch (e) {
        error = e;
      }

      expect(error).to.exist();
      expect(error).to.be.an.instanceof(Error);
    });

    it('should fail if cwd is not a directory.', async () => {
      const options = {cwd: `${__dirname}/artifacts/routes/single_route.js`};

      try {
        await utils.loadFilesFromDir('*.js', options);
      } catch (error) {
        expect(error).to.exist();
        expect(error).to.be.an.instanceof(Error);
      }
    });
  });
});
