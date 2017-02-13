exports.main = {
  method: (route, options) => {
    return (request, reply) => {
      return reply({handler: 'main', options: options});
    };
  }
};
