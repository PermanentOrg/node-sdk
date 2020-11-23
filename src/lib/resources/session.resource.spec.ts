import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermSdkError } from '../error';

import { ArchiveStore } from './archive';
import { SessionResource } from './session.resource';

const test = anyTest as TestInterface<{
  session: SessionResource;
  api: ApiService;
  archiveStore: ArchiveStore;
}>;

test.beforeEach((t) => {
  const api = new ApiService('session', 'mfa', 'test');
  const archiveStore = new ArchiveStore();
  t.context = {
    api,
    archiveStore,
    session: new SessionResource(api, archiveStore),
  };
});

test('should create', (t) => {
  t.assert(t.context.session);
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

  const isLoggedIn = await t.context.session.isSessionValid();

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

  const isLoggedIn = await t.context.session.isSessionValid();

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

  const isLoggedIn = await t.context.session.isSessionValid();

  t.assert(!isLoggedIn);
});

test('returns false for errored request', async (t) => {
  const responseFake = sinon.fake.throws(new Error('error'));
  sinon.replace(t.context.api.auth, 'isLoggedIn', responseFake);

  const isLoggedIn = await t.context.session.isSessionValid();

  t.assert(!isLoggedIn);
});

test('set archive in ArchiveStore after successful archive change request', async (t) => {
  sinon.replace(t.context.session, 'isSessionValid', sinon.fake.resolves(true));

  const archiveNbr = '0003-0000';

  const changeArchiveResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            ArchiveVO: {
              archiveNbr,
            },
          },
        ],
      },
    ],
  };

  const changeArchiveResponseFake = sinon.fake.resolves(changeArchiveResponse);
  sinon.replace(t.context.api.archive, 'change', changeArchiveResponseFake);

  await t.context.session.useArchive(archiveNbr);

  t.is(t.context.archiveStore.getArchive()?.archiveNbr, archiveNbr);
});

test('throw error on change if credentials invalid', async (t) => {
  sinon.replace(
    t.context.session,
    'isSessionValid',
    sinon.fake.resolves(false)
  );

  const archiveNbr = '0003-0000';
  const error = await t.throwsAsync(t.context.session.useArchive(archiveNbr));
  t.assert(error instanceof PermSdkError);
});

test('throw error on change if failed request', async (t) => {
  sinon.replace(t.context.session, 'isSessionValid', sinon.fake.resolves(true));

  const archiveNbr = '0003-0000';
  const changeArchiveResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: false,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            ArchiveVO: {
              archiveNbr,
            },
          },
        ],
      },
    ],
  };

  const responseFake = sinon.fake.resolves(changeArchiveResponse);
  sinon.replace(t.context.api.archive, 'change', responseFake);

  const error = await t.throwsAsync(t.context.session.useArchive(archiveNbr));
  t.assert(error.message.includes(archiveNbr));
});
