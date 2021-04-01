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
  archiveNbr,
  apiKey,
  baseUrl, // optional, defaults to prod environment URL
});

// initialize client and session
await permanent.init();

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

## Examples

### Uploading a file

Currently, only uploading files from a public-accessible URL is supported. A file is referred to as a `record` in the Permanent.org API, as `file` has a specific meaning internally that may cause conflict or confusion. In the UI, the term "files" is used for simplicity.

To upload a file to the current archive, use `record.uploadFromUrl`. `uploadUri` is the public URL used to retrieve the file, while `uploadFileName` must be specified with the proper extension to ensure correct file processing. `displayName` is the name that will be shown for the file in the UI.

To upload to a specific folder, use the optional second parameter to provide an existing `folder`, otherwise the file will be uploaded to the root "My Files" folder of the given archive.

```js
const folder // existing folder
const newRecord = await permanent.record.uploadFromUrl(
  {
    uploadUri: 'https://static.wikia.nocookie.net/non-aliencreatures/images/9/90/Mogwai.jpg/revision/latest/scale-to-width-down/300?cb=20110102071311',
    displayName: 'My Gremlin Picture',
    uploadFileName: 'gremlin.jpg'
  },
  folder // optional, specify to upload somewhere besides My Files folder
);
```

### Creating a folder

To create a folder, just provide the name of the folder to `folder.create`. Similarly to `record.uploadFromUrl`, if a specific parent folder is required, provide one. Otherwise, the folder will be created in the root "My Files" folder.

```js
const existingFolder;
const newFolder = await permanent.folder.create(
  'Folder To Share',
  existingFolder // optional, specify to create somewhere besides My Files folder
);
```
