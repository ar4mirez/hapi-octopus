const internals = {};

exports.status = {
  method: (route, options) => {
    if (!options.action) {
      return (request, reply) => {
        return reply({handler: 'status', options: options});
      };
    }

    return internals[options.action].method(route, options);
  }
};

internals.ping = exports.ping = {
  name: 'ping',
  method: (route, options) => {
    return (request, reply) => {
      return reply({ping: true, options: options});
    };
  }
};

internals.pong = exports.pong = {
  method: (route, options) => {
    return (request, reply) => {
      return reply({pong: true, options: options});
    };
  }
};

