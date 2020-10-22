import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';

import { AuthResource } from './auth.resource';

const test = anyTest as TestInterface<{
  auth: AuthResource;
  api: ApiService;
}>;

test.beforeEach((t) => {
  const api = new ApiService('session', 'mfa', 'test');
  t.context = {
    api,
    auth: new AuthResource(api),
  };
});

test('returns true for valid session', async (t) => {
  const loggedInResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            SimpleVO: {
              key: 'bool',
              value: true,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(loggedInResponse);
  sinon.replace(t.context.api.auth, 'isLoggedIn', responseFake);

  const isLoggedIn = await t.context.auth.isSessionValid();

  t.assert(isLoggedIn);
});

test('returns false for invalid session', async (t) => {
  const loggedInResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            SimpleVO: {
              key: 'bool',
              value: false,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(loggedInResponse);
  sinon.replace(t.context.api.auth, 'isLoggedIn', responseFake);

  const isLoggedIn = await t.context.auth.isSessionValid();

  t.assert(!isLoggedIn);
});

test('returns false for response.isSuccessful = false', async (t) => {
  const loggedInResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: false,
    isSystemUp: true,
    Results: [
      {
        data: [{}],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(loggedInResponse);
  sinon.replace(t.context.api.auth, 'isLoggedIn', responseFake);

  const isLoggedIn = await t.context.auth.isSessionValid();

  t.assert(!isLoggedIn);
});

test('returns false for errored request', async (t) => {
  const responseFake = sinon.fake.throws(new Error('error'));
  sinon.replace(t.context.api.auth, 'isLoggedIn', responseFake);

  const isLoggedIn = await t.context.auth.isSessionValid();

  t.assert(!isLoggedIn);
});
