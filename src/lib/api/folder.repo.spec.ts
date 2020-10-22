import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { PermanentApiRequestData } from '../model';

import { CsrfStore } from './csrf';
import { FolderRepo } from './folder.repo';

const test = anyTest as TestInterface<{
  folderRepo: FolderRepo;
  csrfStore: CsrfStore;
}>;

const apiKey = 'apiKey';

test.beforeEach('New FolderRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    folderRepo: new FolderRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('should create', (t) => {
  t.assert(t.context.folderRepo);
});

test('should call getRoot endpoint', async (t) => {
  const requestFake = sinon.fake.resolves(true);

  sinon.replace(t.context.folderRepo, 'request', requestFake);

  await t.context.folderRepo.getRoot();

  t.assert(requestFake.calledOnceWith('/folder/getRoot'));
});

test('should call post endpoint with proper FolderVO structure', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const displayName = 'folder name';
  const parentFolderId = 2;
  const parentFolder_linkId = 3;

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      FolderVO: {
        displayName,
        parentFolderId,
        parentFolder_linkId
      },
    },
  ];

  sinon.replace(t.context.folderRepo, 'request', requestFake);
  await t.context.folderRepo.post(displayName, parentFolderId, parentFolder_linkId);

  t.assert(requestFake.calledOnceWith('/folder/post', expectedRequestData));
});