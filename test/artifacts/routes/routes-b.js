exports.ping = {
  routes: [
    {
      method: 'GET',
      path: '/ping',
      handler: async (request, h) => {
        return h.response({route: 'ping'});
      }
    }
  ]
};
