exports.status = {
  method: (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/status',
        handler: async (request, h) => {
          return h.response({route: 'status'});
        }
      },
      {
        method: 'GET',
        path: '/status/{id}',
        handler: async (request, h) => {
          return h.response({route: 'status:id', options: options});
        }
      }
    ]);
  }
};

exports.root = {
  routes: {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return h.response({route: 'root'});
    }
  }
};
