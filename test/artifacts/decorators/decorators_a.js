exports.reply404 = {
  decorate: 'toolkit',
  method: function () {
    return this.response({
      message: 'Standard 404 Error.'
    });
  }
};

exports.sanitizePayload = {
  decorate: 'request',
  method: function (request) {
    return request.payload;
  },
  options: {
    apply: true
  }
};
