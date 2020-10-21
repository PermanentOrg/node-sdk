import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

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
