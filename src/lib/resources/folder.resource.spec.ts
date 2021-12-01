import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermSdkError } from '../error';
import { FolderVO } from '../model';

import { ArchiveStore } from './archive';
import { FolderResource } from './folder.resource';

const test = anyTest as TestInterface<{
  folder: FolderResource;
  api: ApiService;
  archiveStore: ArchiveStore;
}>;

test.beforeEach((t) => {
  const api = ApiService.fromSession('session', 'mfa', 'test');
  const archiveStore = new ArchiveStore();

  archiveStore.setRoot({
    folderId: 1,
    folder_linkId: 1,
    ChildItemVOs: [
      {
        folderId: 2,
        folder_linkId: 2,
        type: 'type.folder.root.private',
      },
    ],
  });
  t.context = {
    api,
    archiveStore,
    folder: new FolderResource(api, archiveStore),
  };
});

test('should create', (t) => {
  t.assert(t.context.folder);
});

test('should return the new FolderVO on successful response', async (t) => {
  const displayName = 'Folder';
  const parentFolder_linkId = 3;

  const newFolder: FolderVO = {
    folderId: 98,
    folder_linkId: 3,
    displayName: 'Folder',
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            FolderVO: newFolder,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.folder, 'post', responseFake);

  const folder = await t.context.folder.create(displayName, {
    folder_linkId: parentFolder_linkId,
  });

  t.deepEqual(folder, newFolder);
});

test('should use the private root if no parent folder provided', async (t) => {
  const displayName = 'Folder';
  const newFolder: FolderVO = {
    folderId: 98,
    folder_linkId: 3,
    displayName: 'Folder',
  };

  const privateRootLinkId = t.context.archiveStore.getPrivateRoot()
    .folder_linkId;

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            FolderVO: newFolder,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.folder, 'post', responseFake);

  await t.context.folder.create(displayName);

  t.assert(responseFake.calledOnceWith(displayName, privateRootLinkId));
});

test('should throw error on unsuccessful response', async (t) => {
  const displayName = 'Folder';
  const parentFolder_linkId = 3;

  const errorMessage = 'error.message';

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: false,
    isSystemUp: true,
    Results: [
      {
        data: [],
        message: [errorMessage],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.folder, 'post', responseFake);

  const error = await t.throwsAsync(
    t.context.folder.create(displayName, { folder_linkId: parentFolder_linkId })
  );

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes(errorMessage));
});
