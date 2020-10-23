import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { FolderVO, PermanentApiRequestData, RecordVO } from '../model';

import { CsrfStore } from './csrf';
import { ShareRepo } from './share.repo';

const test = anyTest as TestInterface<{
  shareRepo: ShareRepo;
  csrfStore: CsrfStore;
}>;

const apiKey = 'apiKey';

test.beforeEach('New ShareRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    shareRepo: new ShareRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('should create', (t) => {
  t.assert(t.context.shareRepo);
});

test('should call generateShareLink with proper data for record', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const recordToShare: Pick<RecordVO, 'folder_linkId'> = { folder_linkId: 1 };

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      RecordVO: recordToShare,
    },
  ];
  sinon.replace(t.context.shareRepo, 'request', requestFake);

  await t.context.shareRepo.generateRecordShareLink(recordToShare);

  t.assert(
    requestFake.calledOnceWith('/share/generateShareLink', expectedRequestData)
  );
});

test('should call generateShareLink with proper data for folder', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const folderToShare: Pick<FolderVO, 'folder_linkId'> = { folder_linkId: 1 };

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      FolderVO: folderToShare,
    },
  ];
  sinon.replace(t.context.shareRepo, 'request', requestFake);

  await t.context.shareRepo.generateFolderShareLink(folderToShare);

  t.assert(
    requestFake.calledOnceWith('/share/generateShareLink', expectedRequestData)
  );
});
