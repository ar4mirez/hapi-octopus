# hapi-octopus

[![travis build](https://img.shields.io/travis/ar4mirez/hapi-octopus.svg?style=flat-square)](https://travis-ci.org/ar4mirez/hapi-octopus)
[![codecov coverage](https://img.shields.io/codecov/c/github/ar4mirez/hapi-octopus.svg?style=flat-square)](https://codecov.io/github/ar4mirez/hapi-octopus)
[![version](https://img.shields.io/npm/v/hapi-octopus.svg?style=flat-square)](http://npm.im/hapi-octopus)
[![downloads](https://img.shields.io/npm/dm/hapi-octopus.svg?style=flat-square)](http://npm-stat.com/charts.html?package=hapi-octopus&from=2015-08-01)
[![SEE LINCESE](https://img.shields.io/npm/l/hapi-octopus.svg?style=flat-square)](https://github.com/ar4mirez/hapi-octopus/blob/master/LICENSE.md)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

***hapi v17 version***

A multi-purpose plugin that allows you to autoload `methods`, `handlers`,
`routes` and `decorators` using a simple signature convention.

***Is currently in a sort of stable version. I'm trying to keep it with 100% coverage
but just be aware the API might change a little based on my needs or beacuse I love
refactoring :p. Any help is apreciated if you are nice and polite.***

## Installation

```javascript
npm i --save hapi-octopus
```

## Usage

```javascript
const octopus = require('hapi-octopus');

// using server register.
await server.register({
  plugin: octopus,
  options: {
    methods: {
      cwd: `${process.cwd()}/methods`
    },
    handlers: {
      cwd: `${process.cwd()}/handlers`
    },
    routes: {
      cwd: `${process.cwd()}/routes`
    },
    decorators: {
      cwd: `${process.cwd()}/decorators`
    }
  }
}});

// using manifest.
{
  ...
  registration: [
    {
      plugin: octopus,
      options: {
        methods: {
          cwd: `${process.cwd()}/methods`
        },
        handlers: {
          cwd: `${process.cwd()}/handlers`
        },
        routes: {
          cwd: `${process.cwd()}/routes`
        },
        decorators: {
          cwd: `${process.cwd()}/decorators`
        }
      }
    }
  ]
}
```

### Register methods.

#### Signature
`name: string`: optional if not present export.key will be used instead. ex: `exports.multiply`

`method: function`: required body of method in hapijs. [methods](https://hapijs.com/api#servermethodmethods)

`options: object`: optional same in hapijs. [methods](https://hapijs.com/api#servermethodname-method-options)

`prefix: string`: optional if not present filename will be used instead. ex: `math.js`.

```javascript

// /path/to/methods/math.js

exports.mulitply = {
  method: (a, b) => (a * b),
  options: {},
};
/*
  this method will be available as:
    - server.methods.math.multiply(2, 4);
  optional values prefix and name are the same as saying
    - prefix = 'math'
    - name = 'multiply'
*/

```

### Register handlers.

#### Signature
`name: string`: optional if not present export.key will be used instead. ex: `exports.multiply`

`method: function`: required see in hapijs. [handlers](https://hapijs.com/api#serverhandlername-method)

`options: object`: optional same in hapijs. [handlers](https://hapijs.com/api#serverhandlername-method)

`prefix: string`: optional if not present filename will be used instead. ex: `math.js`.

```javascript
// /path/to/handlers/customer.js

exports.all = {
  method: (route, options) => {
    return (request, h) => {
      ...
      return {
        total: 10,
        data: customers
      })
    }
  }
};

/*
  this method will be available as:
    - server.methods.math.multiply(2, 4);
  optional values prefix and name are the same as saying
    - prefix = 'customer'
    - name = 'all'
*/

// in a route you can use it like this.

server.route({
  method: 'GET',
  path: '/customer/create',
  handler: {
    customerAll: {} // always prefix+name camelCase.
  }
})
```

### Register routes.

Routes can be registered in 2 ways: exporting an array|object or using a function.

#### Array| Object Signature
`routes: array|object`: required for this signature should return an array or object of hapijs [routes](https://hapijs.com/api#serverrouteoptions).

```javascript
exports.customers = {
  routes: [
    {method: 'GET', path: '/customers', handler: {customerAll: {}}},
    {method: 'POST', path: '/customers', handler: {customerCreate: {}}}
  ]
}

exports.update = {
  routes: {
    method: 'PATCH',
    path: '/customers/{id}',
    handler: {
      customerUpdate: {}
    }
  }
}
```

#### Function Signature
`method: function`: required for this signature should receive a server object.

`options: object`: optional options to be passed a long with server object.

```javascript
exports.customers = {
  method: (server, options) => {
    console.log(options);

    server.route([
      {method: 'GET', path: '/customers', handler: {customerAll: {}}},
      {method: 'POST', path: '/customers', handler: {customerCreate: {}}}
    ])
  }
}
```

### Register decorators.

`decorate: string`: required and accept only `request|toolkit|server`.

`name: string`: optional name must be unique since will be used as accessor
from decoration, if name is not passed `exports.key` will be used instead.

`method: any`: required could be anything from `object|array|function|string` is what you'll get from decoration.

see more info about [decorators](https://hapijs.com/api#serverdecoratetype-property-method-options)

````javascript
exports.reply404 = {
  decorate: 'toolkit',
  method: () => {
    return this.response({
      message: 'Standard 404 error'
    });
  }
};

// will be accesible from a handler like:

...
handler: (request, h) => {
  return h.response(({anotherMessage: 'ahh whatever really.'}).code(404);
}

````
