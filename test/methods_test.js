const {describe, it, expect, pkg, beforeEach} = require('./lab');
const plugin = require('../lib');
const hapi = require('hapi');

describe(`${pkg.name}:plugin`, () => {
  let server;

  beforeEach(done => {
    server = new hapi.Server();
    server.connection({host: 'localhost', port: 80});

    return done();
  });

  const register = (options, callback) => {
    return server.register({
      register: plugin,
      options: options
    }, callback);
  };

  it('should successfully register methods.', done => {
    const options = {
      methods: {
        cwd: `${process.cwd()}/test/artifacts/methods`
      }
    };

    register(options, error => {
      expect(error).to.not.exist();
      expect(server.registrations).to.include(pkg.name);
      expect(server.methods).to.include(['namespaceA', 'namespaceB', 'namespaceC']);

      console.log(server.methods);

      return done();
    });
  });
});
