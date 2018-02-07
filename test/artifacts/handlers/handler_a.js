const internals = {};

exports.status = {
  method: (route, options) => {
    if (!options.action) {
      return async (request, h) => {
        return h.response({handler: 'status', options: options});
      };
    }

    return internals[options.action].method(route, options);
  }
};

exports.ping = {
  name: 'ping',
  method: (route, options) => {
    return async (request, h) => {
      return h.response({ping: true, options: options});
    };
  }
};
internals.ping = exports.ping;

exports.pong = {
  method: (route, options) => {
    return async (request, h) => {
      return h.response({pong: true, options: options});
    };
  }
};
internals.pong = exports.pong;
