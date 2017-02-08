exports.multiply = {
  name: 'multiply',
  method: (a, b) => {
    return a * b;
  },
  options: {}
};

exports.divide = {
  name: 'divide',
  method: (a, b) => {
    return a / b;
  },
  options: {}
};

exports.substract = {
  prefix: 'namespace-c',
  method: (a, b) => {
    return a - b;
  }
};
