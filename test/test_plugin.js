const lab = require('./lab');
const plugin = require('../lib');
const hapi = require('hapi');

const describe = lab.describe;
const it = lab.it;
const expect = lab.expect;
const pkg = lab.pkg;
const beforeEach = lab.beforeEach;

describe(`${pkg.name}:plugin`, () => {
  let server;

  const options = {
    methods: {
      cwd: `${process.cwd()}/test/artifacts/methods`
    },
    handlers: {
      cwd: `${process.cwd()}/test/artifacts/handlers`
    },
    routes: {
      cwd: `${process.cwd()}/test/artifacts/routes`
    },
    decorators: {
      cwd: `${process.cwd()}/test/artifacts/decorators`
    }
  };

  beforeEach(done => {
    server = new hapi.Server();
    server.connection({host: 'localhost', port: 80});

    return done();
  });

  function register(options, callback) {
    return server.register({
      register: plugin,
      options: options
    }, callback);
  }

  it('should successfully load methods.', done => {
    register({methods: options.methods}, () => {
      expect(server.methods).to.include(['namespaceA']);
      expect(server.methods.namespaceA).to.include(['multiply']);
      expect(server.methods.namespaceA.multiply).to.be.a.function();

      return done();
    });
  });

  it('should successfully load handlers.', done => {
    register({handlers: options.handlers}, () => {
      server.route({
        method: 'GET',
        path: '/status/ping',
        handler: {
          handlerAStatus: {
            action: 'ping'
          }
        }
      });

      server.inject({method: 'GET', url: '/status/ping'}, response => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result.ping).to.be.true();

        return done();
      });
    });
  });

  it('should successfully load routes.', done => {
    register({routes: options.routes}, () => {
      server.inject({method: 'GET', url: '/status'}, response => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.equal({route: 'status'});

        return done();
      });
    });
  });

  it('should successfully load decorators.', done => {
    register({decorators: options.decorators}, () => {
      expect(server).to.include(['dbConnection']);
      expect(server.dbConnection).to.be.a.function();
      expect(server.dbConnection()).to.be.equal({connected: true});

      return done();
    });
  });

  it('should successfully register plugin.', done => {
    server.register({
      register: plugin,
      options: options
    }, error => {
      expect(error).to.not.exist();
      expect(server.registrations).to.include(pkg.name);

      return done();
    });
  });

  it('should fail if a file is passed instead of directory.', done => {
    register({
      methods: {
        cwd: `${options.methods.cwd}/namespace_a.js`
      }
    }, error => {
      expect(error).to.exist();

      return done();
    });
  });
});
