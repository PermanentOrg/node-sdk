import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermSdkError } from '../error';

import { ArchiveStore } from './archive';
import { RecordResource } from './record.resource';

const test = anyTest as TestInterface<{
  record: RecordResource;
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
    record: new RecordResource(api, archiveStore),
  };
});

test('should create', (t) => {
  t.assert(t.context.record);
});

test('should return the new RecordVO on successful response', async (t) => {
  const displayName = 'file';
  const uploadFileName = 'file.jpg';
  const uploadUri = 'https://file.com/file.jpg';
  const parentFolder_linkId = 3;
  const description = 'description of the item';

  const newRecord = {
    recordId: 98,
    parentFolderId: 4,
    parentFolder_linkId,
    displayName,
    description,
    uploadFileName,
    folder_linkId: 5,
    archiveId: 10,
    archiveNbr: 'archiveNbr',
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            RecordVO: newRecord,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.record, 'post', responseFake);

  const record = await t.context.record.uploadFromUrl(
    {
      displayName,
      uploadFileName,
      uploadUri,
      description,
    },
    { folder_linkId: parentFolder_linkId }
  );

  t.deepEqual(record, newRecord);
});

test('should use the private root if no parent folder provided', async (t) => {
  const displayName = 'file';
  const uploadFileName = 'file.jpg';
  const uploadUri = 'https://file.com/file.jpg';

  const privateRootLinkId = t.context.archiveStore.getPrivateRoot()
    .folder_linkId;

  const newRecord = {
    recordId: 98,
    parentFolderId: 4,
    parentFolder_linkId: privateRootLinkId,
    displayName,
    uploadFileName,
    folder_linkId: 5,
    archiveId: 10,
    archiveNbr: 'archiveNbr',
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            RecordVO: newRecord,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.record, 'post', responseFake);

  await t.context.record.uploadFromUrl({
    displayName,
    uploadFileName,
    uploadUri,
  });

  t.assert(
    responseFake.calledOnceWith(
      displayName,
      uploadFileName,
      uploadUri,
      privateRootLinkId
    )
  );
});

test('should throw error on unsuccessful response', async (t) => {
  const displayName = 'file';
  const uploadFileName = 'file.jpg';
  const uploadUri = 'https://file.com/file.jpg';
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

  sinon.replace(t.context.api.record, 'post', responseFake);

  const error = await t.throwsAsync(
    t.context.record.uploadFromUrl(
      {
        displayName,
        uploadFileName,
        uploadUri,
      },
      { folder_linkId: parentFolder_linkId }
    )
  );

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes(errorMessage));
});

test('should return specified record', async (t) => {
  const recordTestId = 101;
  const privateRootLinkId = t.context.archiveStore.getPrivateRoot()
    .folder_linkId;
  const existingRecord = {
    recordId: recordTestId,
    displayName: 'some display name',
    folder_linkId: 5,
    uploadFileName: 'some_filename.txt',
    parentFolderId: privateRootLinkId,
    parentFolder_linkId: 4,
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            RecordVO: existingRecord,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);
  sinon.replace(t.context.api.record, 'getById', responseFake);

  const returnedRecord = await t.context.record.getRecordById(recordTestId);

  t.deepEqual(returnedRecord, existingRecord);
});
