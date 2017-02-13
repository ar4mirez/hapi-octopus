exports.status = {
  method: (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/status',
        handler: (request, reply) => {
          return reply({route: 'status'});
        }
      },
      {
        method: 'GET',
        path: '/status/{id}',
        handler: (request, reply) => {
          return reply({route: 'status:id', options: options});
        }
      }
    ]);
  }
};

exports.root = {
  routes: {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply({route: 'root'});
    }
  }
};

