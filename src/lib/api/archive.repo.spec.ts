import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { PermanentApiData } from '../model';
import { ArchiveVO } from '../model/archive-vo';

import { ArchiveRepo } from './archive.repo';
import { CsrfStore } from './csrf';

const test = anyTest as TestInterface<{
  archiveRepo: ArchiveRepo;
  csrfStore: CsrfStore;
}>;

const apiKey = 'apiKey';

test.beforeEach('New ArchiveRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    archiveRepo: new ArchiveRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('should create', (t) => {
  t.assert(t.context.archiveRepo);
});

test('should call change endpoint with ArchiveVO', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const archive: ArchiveVO = {
    archiveId: 1,
    archiveNbr: '0001-0000',
  };

  const expectedRequestData: PermanentApiData[] = [
    {
      ArchiveVO: archive,
    },
  ];

  sinon.replace(t.context.archiveRepo, 'request', requestFake);

  await t.context.archiveRepo.change(archive);

  t.assert(requestFake.calledOnceWith('/archive/change', expectedRequestData));
});
