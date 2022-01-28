import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { FolderVO, RecordVO } from '../model';

import { ArchiveStore } from './archive';
import { FolderResource } from './folder.resource';
import { ItemResource } from './item.resource';
import { RecordResource } from './record.resource';

const test = anyTest as TestInterface<{
  api: ApiService;
  archiveStore: ArchiveStore;
  folder: FolderResource;
  item: ItemResource;
  record: RecordResource;
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

  const folder = new FolderResource(api, archiveStore);
  const record = new RecordResource(api, archiveStore);
  const item = new ItemResource(folder, record);
  t.context = {
    api,
    archiveStore,
    folder,
    item,
    record,
  };
});

test('should create', (t) => {
  t.assert(t.context.item);
});

test('should be able to call proper copy endpoint', async (t) => {
  const destinationFolder: FolderVO = {
    folderId: 1,
    folder_linkId: 1,
  };
  const folder: FolderVO = {
    folderId: 2,
    folder_linkId: 2,
  };
  const record: RecordVO = {
    displayName: 'Potato',
    folder_linkId: 3,
    uploadFileName: 'Potato.gif',
    parentFolderId: 2,
    parentFolder_linkId: 2,
  };

  const folderFake = sinon.fake.resolves({
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            FolderVO: folder,
          },
        ],
      },
    ],
  });
  const recordFake = sinon.fake.resolves({
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            RecordVO: record,
          },
        ],
      },
    ],
  });

  sinon.replace(t.context.api.folder, 'request', folderFake);
  sinon.replace(t.context.api.record, 'request', recordFake);

  t.assert(!folderFake.called);
  t.assert(!recordFake.called);
  t.context.item.copy(folder, destinationFolder);
  t.assert(folderFake.calledOnceWith('/folder/copy'));
  t.assert(!recordFake.called);
  t.context.item.copy(record, destinationFolder);
  t.assert(recordFake.calledOnceWith('/record/copy'));
});
