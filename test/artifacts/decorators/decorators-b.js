exports.dbConnection = {
  decorate: 'server',
  method: function () {
    return {connected: true};
  }
};
