import anyTest, { TestFn } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { FolderVO, PermanentApiRequestData } from '../model';

import { CsrfStore } from './csrf';
import { FolderRepo } from './folder.repo';

const test = anyTest as TestFn<{
  folderRepo: FolderRepo;
  csrfStore: CsrfStore;
}>;

test.beforeEach('New FolderRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    folderRepo: new FolderRepo({
      csrfStore,
      axiosInstance,
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
  const parentFolder_linkId = 3;

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      FolderVO: {
        displayName,
        parentFolder_linkId,
      },
    },
  ];

  sinon.replace(t.context.folderRepo, 'request', requestFake);
  await t.context.folderRepo.post(displayName, parentFolder_linkId);

  t.assert(requestFake.calledOnceWith('/folder/post', expectedRequestData));
});

test('should call the getPublicRoot endpoint', async (t) => {
  const requestFake = sinon.fake.resolves(true);

  sinon.replace(t.context.folderRepo, 'request', requestFake);

  await t.context.folderRepo.getPublicRoot();

  t.assert(requestFake.calledOnceWith('/folder/getPublicRoot'));
});

test('should call the copy endpoint', async (t) => {
  const requestFake = sinon.fake.resolves(true);

  sinon.replace(t.context.folderRepo, 'request', requestFake);

  const folder: FolderVO = {
    folderId: 1,
    folder_linkId: 1,
  };

  const destination: FolderVO = {
    folderId: 2,
    folder_linkId: 2,
  };

  await t.context.folderRepo.copy([folder], destination);

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      FolderVO: {
        folderId: 1,
        folder_linkId: 1,
      },
      FolderDestVO: {
        folder_linkId: 2,
      },
    },
  ];

  t.assert(requestFake.calledOnceWith('/folder/copy', expectedRequestData));
});
