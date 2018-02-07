exports.main = {
  method: (route, options) => {
    return async (request, h) => {
      return h.response({handler: 'main', options: options});
    };
  }
};
