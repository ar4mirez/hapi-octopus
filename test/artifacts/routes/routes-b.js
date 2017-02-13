exports.ping = {
  routes: [
    {
      method: 'GET',
      path: '/ping',
      handler: (request, reply) => {
        return reply({route: 'ping'});
      }
    }
  ]
};
