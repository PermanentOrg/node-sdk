# node-sdk

Node.js SDK for Permanent.org

Built on [bitjson/typescript-starter](https://github.com/bitjson/typescript-starter)

![Unit tests](https://github.com/PermanentOrg/node-sdk/workflows/Unit%20tests/badge.svg?branch=main)

## Usage

The client needs to be configured with access keys, available on request from engineers@permanent.org.

```js
// ES import
import { Permanent } from '@permanentorg/node-sdk';

// CommonJS
const Permanent = require('@permanentorg/node-sdk').Permanent;

// Configure with credentials
const permanent = new Permanent({
  sessionToken,
  mfaToken,
  accountId,
  archiveId,
});

// Ready to use!
const isSessionValid = await permanent.auth.isSessionValid();
```

## Developing

To start working, run the `watch:build` task using [`npm`](https://docs.npmjs.com/getting-started/what-is-npm) or [`yarn`](https://yarnpkg.com/).

```sh
npm run watch:build
```

In another terminal tab/window, run the `watch:test` task:

```sh
npm run watch:test
```

## Testing

To run all tests (unit tests, formatting, linting), run the `test` task:

```sh
npm run test
```
