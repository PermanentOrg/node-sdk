import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { PermanentApiRequestData } from '../model';

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
  const folder_linkId = 1;

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      RecordVO: { folder_linkId },
    },
  ];
  sinon.replace(t.context.shareRepo, 'request', requestFake);

  await t.context.shareRepo.generateShareLink(folder_linkId);

  t.assert(
    requestFake.calledOnceWith('/share/generateShareLink', expectedRequestData)
  );
});

test('should call generateShareLink with proper data for folder', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const folder_linkId = 1;

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      FolderVO: { folder_linkId },
    },
  ];
  sinon.replace(t.context.shareRepo, 'request', requestFake);

  await t.context.shareRepo.generateShareLink(folder_linkId, true);

  t.assert(
    requestFake.calledOnceWith('/share/generateShareLink', expectedRequestData)
  );
});
