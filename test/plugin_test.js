const {describe, it, expect, pkg} = require('./lab');
const plugin = require('../lib');
const hapi = require('hapi');

describe(`${pkg.name}:plugin`, () => {
  const server = new hapi.Server();
  server.connection({host: 'localhost', port: 80});

  it('should successfully register plugin.', done => {
    const options = {
      methods: {
        cwd: `${process.cwd()}/test/artifacts/methods`
      }
    };

    server.register({
      register: plugin,
      options: options
    }, error => {
      expect(error).to.not.exist();
      expect(server.registrations).to.include(pkg.name);

      return done();
    });
  });
});
