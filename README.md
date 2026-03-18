# hapi-octopus

[![npm version](https://img.shields.io/npm/v/@ar4mirez/hapi-octopus.svg)](https://www.npmjs.com/package/@ar4mirez/hapi-octopus)
[![CI](https://github.com/ar4mirez/hapi-octopus/actions/workflows/ci.yml/badge.svg)](https://github.com/ar4mirez/hapi-octopus/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Auto-load routes, methods, handlers, and decorators from directories using glob patterns.

## Requirements

- Node.js >= 18
- `@hapi/hapi` ^21

## Installation

```bash
npm install @ar4mirez/hapi-octopus
```

## Usage

```js
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = new Hapi.Server({ host: 'localhost', port: 3000 });

  await server.register({
    plugin: require('@ar4mirez/hapi-octopus'),
    options: {
      methods:    { cwd: `${process.cwd()}/lib/methods` },
      handlers:   { cwd: `${process.cwd()}/lib/handlers` },
      routes:     { cwd: `${process.cwd()}/lib/routes` },
      decorators: { cwd: `${process.cwd()}/lib/decorators` }
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
```

## API / Options

Each top-level key (`methods`, `handlers`, `routes`, `decorators`) is optional and accepts the following configuration:

| Option    | Type   | Default         | Description                    |
|-----------|--------|-----------------|--------------------------------|
| `cwd`     | string | `process.cwd()` | Directory to scan for files    |
| `pattern` | string | `'*.js'`        | Glob pattern to match files    |

## File Conventions

Filenames are converted to **camelCase** and used as the namespace key when registering with the server.

### Methods (`lib/methods/namespace_a.js`)

Each export becomes a named method registered under `server.methods.<camelCaseFilename>.<exportName>`.

```js
// lib/methods/math_utils.js
exports.multiply = {
  name: 'multiply',
  method: (a, b) => a * b,
  options: { cache: { expiresIn: 60000 } }
};

exports.add = {
  name: 'add',
  method: (a, b) => a + b,
  options: {}
};

// Registered as:
// server.methods.mathUtils.multiply(3, 4) // => 12
// server.methods.mathUtils.add(1, 2)      // => 3
```

### Routes (`lib/routes/api.js`)

Each export should contain a `routes` array of standard hapi route objects.

```js
// lib/routes/health.js
exports.status = {
  routes: [
    {
      method: 'GET',
      path: '/status',
      handler: async (request, h) => h.response({ ok: true })
    }
  ]
};
```

### Handlers (`lib/handlers/upload.js`)

Each export is a named handler function registered via `server.decorate('handler', ...)`.

```js
// lib/handlers/file_upload.js
exports.upload = function (route, options) {
  return async (request, h) => {
    // handle file upload
    return h.response({ uploaded: true });
  };
};

// Use in routes:
// handler: { upload: { dest: '/tmp' } }
```

### Decorators (`lib/decorators/utils.js`)

Each export configures a server, request, or toolkit decoration.

```js
// lib/decorators/helpers.js
exports.formatDate = {
  decorate: 'server',    // 'server' | 'request' | 'toolkit'
  name: 'formatDate',
  method: function (date) {
    return new Date(date).toISOString();
  }
};

// Registered as: server.formatDate(new Date())
```

## License

ISC © [Angel Ramirez](https://github.com/ar4mirez)
