import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { PermanentApiRequestData, RecordVOFromUrl } from '../model';

import { CsrfStore } from './csrf';
import { RecordRepo } from './record.repo';

const test = anyTest as TestInterface<{
  recordRepo: RecordRepo;
  csrfStore: CsrfStore;
}>;

const apiKey = 'apiKey';

test.beforeEach('New RecordRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    recordRepo: new RecordRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('should create', (t) => {
  t.assert(t.context.recordRepo);
});

test('should call post endpoint with proper RecordVO structure', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const displayName = 'filename';
  const uploadFileName = 'file.zip';
  const uploadUri = 'http://file.com/file.zip';
  const parentFolder_linkId = 3;

  const record: RecordVOFromUrl = {
    displayName,
    uploadFileName,
    uploadUri,
    parentFolder_linkId,
    status: 'status.record.only_meta',
  };
  const expectedRequestData: PermanentApiRequestData[] = [
    {
      RecordVO: record,
    },
  ];

  sinon.replace(t.context.recordRepo, 'request', requestFake);
  await t.context.recordRepo.post(
    displayName,
    uploadFileName,
    uploadUri,
    parentFolder_linkId
  );

  t.assert(requestFake.calledOnceWith('/record/post', expectedRequestData));
});
