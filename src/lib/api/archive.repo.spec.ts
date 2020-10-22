import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { PermanentApiRequestData } from '../model';

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

test('should call getByArchiveNbr endpoint with ArchiveVO', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const archiveNbr = '0001-0000';

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      ArchiveVO: {
        archiveNbr,
      },
    },
  ];

  sinon.replace(t.context.archiveRepo, 'request', requestFake);

  t.context.archiveRepo.getByArchiveNbr(archiveNbr);

  t.assert(
    requestFake.calledOnceWith('/archive/getByArchiveNbr', expectedRequestData)
  );
});

test('should call change endpoint with ArchiveVO', async (t) => {
  const requestFake = sinon.fake.resolves(true);
  const archiveNbr = '0001-0000';

  const expectedRequestData: PermanentApiRequestData[] = [
    {
      ArchiveVO: {
        archiveNbr,
      },
    },
  ];

  sinon.replace(t.context.archiveRepo, 'request', requestFake);

  await t.context.archiveRepo.change(archiveNbr);

  t.assert(requestFake.calledOnceWith('/archive/change', expectedRequestData));
});
