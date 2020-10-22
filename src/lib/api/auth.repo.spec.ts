import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { AuthRepo } from './auth.repo';
import { CsrfStore } from './csrf';

const test = anyTest as TestInterface<{
  authRepo: AuthRepo;
  csrfStore: CsrfStore;
}>;

const apiKey = 'apiKey';

test.beforeEach('New BaseRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    authRepo: new AuthRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('should create', (t) => {
  t.assert(t.context.authRepo);
});

test('should call loggedIn endpoint', async (t) => {
  const requestFake = sinon.fake.resolves(true);

  sinon.replace(t.context.authRepo, 'request', requestFake);

  await t.context.authRepo.isLoggedIn();

  t.assert(requestFake.calledOnceWith('/auth/loggedIn'));
});
