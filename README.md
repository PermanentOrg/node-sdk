# node-sdk

Node.js SDK for Permanent.org

Built on [bitjson/typescript-starter](https://github.com/bitjson/typescript-starter)

![Unit tests](https://github.com/PermanentOrg/node-sdk/workflows/Unit%20tests/badge.svg?branch=main)

## Usage

The client needs to be configured with authentication tokens.
Please contact engineers@permanent.org for access.

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

### Generating share links

To create a public share link that can be used to request sharing access to an item, use either `share.createRecordShareLink` or `share.createFolderShareLink` to share either a single `record` or a single `folder`, respectively.

The share link defaults to allowing preview of items without having access, and auto-approving access for anyone who requests it, but these options can be specified using optional parameters.

```js
// Upload and share a single record with default settings

const record = await permanent.record.uploadFromUrl({
  /* record data */
});
const recordShareUrl = await permanent.share.createRecordShareLink(record);

// Create and share a folder with preview and auto-approve disabled

const folder = await permanent.folder.create('Shared Photos');
await permanent.record.uploadFromUrl(
  {
    /* record data */
  },
  folder
);
const folderShareUrl = await permanent.share.createFolderShareLink(
  folder,
  false,
  false
);
```

There's also an optional parameter available when creating share links that allows setting the default access level given to archives granted access to the share. An `AccessRole` enum has been exported with all access role values.

```js
import { Permanent, AccessRole } from '@permanentorg/node-sdk';

const folderShareUrl = await permanent.share.createFolderShareLink(
  folder,
  false,
  false,
  AccessRole.Curator
);
```

### Copying items
You can copy items to a specific folder using the `item.copy` method which works on both folders and records. There are also separate type-specific methods, `folder.copy` and `record.copy`.

```js
const privateRoot = await permanent.folder.getMyFilesFolder();
const publicRoot = await permanent.folder.getPublicFolder();
const firstChild = privateRoot.ChildItemVOs.shift();

// Copies the first item in "My Files" to the Public Workspace
await permanent.item.copy(firstChild, publicRoot);
```

Copying to the Public Root (accessible by using `folder.getPublicFolder`) is functionally equivalent to publishing a file in the Permanent web app.
