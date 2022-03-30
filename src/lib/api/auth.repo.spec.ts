import anyTest, { TestFn } from 'ava';
import axios from 'axios';
import * as sinon from 'sinon';

import { AuthRepo } from './auth.repo';
import { CsrfStore } from './csrf';

const test = anyTest as TestFn<{
  authRepo: AuthRepo;
  csrfStore: CsrfStore;
}>;

test.beforeEach('New AuthRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create();

  t.context = {
    csrfStore,
    authRepo: new AuthRepo({
      csrfStore,
      axiosInstance,
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
