'use strict';

const lab = require('./lab');
const plugin = require('../lib');
const hapi = require('hapi');

const describe = lab.describe;
const it = lab.it;
const expect = lab.expect;
const pkg = lab.pkg;
const beforeEach = lab.beforeEach;

describe(`${pkg.name}:plugin`, async () => {
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

  beforeEach(async () => {
    server = new hapi.Server({host: 'localhost', port: 80});
  });

  async function register(options) {
    await server.register({
      plugin: plugin,
      options: options
    });
  }

  it('should successfully load methods.', async () => {
    await register({methods: options.methods});
    expect(server.methods).to.include(['namespaceA']);
    expect(server.methods.namespaceA).to.include(['multiply']);
    expect(server.methods.namespaceA.multiply).to.be.a.function();
  });

  it('should successfully load handlers.', async () => {
    await register({handlers: options.handlers});

    server.route({
      method: 'GET',
      path: '/status/ping',
      handler: {
        handlerAStatus: {
          action: 'ping'
        }
      }
    });

    const response = await server.inject({method: 'GET', url: '/status/ping'});
    expect(response.statusCode).to.be.equal(200);
    expect(response.result.ping).to.be.true();
  });

  it('should successfully load routes.', async () => {
    await register({routes: options.routes});

    const response = await server.inject({method: 'GET', url: '/status'});
    expect(response.statusCode).to.be.equal(200);
    expect(response.result).to.be.equal({route: 'status'});
  });

  it('should successfully load decorators.', async () => {
    await register({decorators: options.decorators});
    expect(server).to.include(['dbConnection']);
    expect(server.dbConnection).to.be.a.function();
    expect(server.dbConnection()).to.be.equal({connected: true});
  });

  it('should successfully register plugin.', async () => {
    let error;

    try {
      await server.register({
        plugin: plugin,
        options: options
      });
    } catch (e) {
      error = e;
    }

    expect(error).to.not.exist();
    expect(server.registrations).to.include(pkg.name);
  });

  it('should fail if a file is passed instead of directory.', async () => {
    let error;

    try {
      await register({
        methods: {
          cwd: `${options.methods.cwd}/namespace_a.js`
        }
      });
    } catch (e) {
      error = e;
    }

    expect(error).to.exist();
  });
});
