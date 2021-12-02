import anyTest, { TestInterface } from 'ava';

import { Permanent, PermanentConstructorConfigI } from './client';

const test = anyTest as TestInterface<{
  options: PermanentConstructorConfigI;
}>;

test.beforeEach((t) => {
  const options: PermanentConstructorConfigI = {
    archiveId: 1,
    sessionToken: 'sessionsessionsession',
    mfaToken: 'mfamfamfa',
    archiveNbr: '0001-0000',
  };
  t.context = {
    options,
  };
});

test('session instance gets config options', (t) => {
  const permanent = new Permanent(t.context.options);
  t.truthy(permanent);
  t.is(permanent.getSessionToken(), t.context.options.sessionToken);
  t.is(permanent.getMfaToken(), t.context.options.mfaToken);
  t.is(permanent.getArchiveNbr(), t.context.options.archiveNbr);
});

test('throws error for missing sessionToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ sessionToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error.message.includes('sessionToken'));
});

test('throws error for missing mfaToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ mfaToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error.message.includes('mfaToken'));
});

test('throws error for missing authentication', async (t) => {
  const error = t.throws(() => {
    new Permanent({});
  });

  t.assert(error.message.includes('at least one of'));
  t.assert(error.message.includes('accessToken'));
  t.assert(error.message.includes('sessionToken'));
});

/* TODO: idk something constructing a mock token is painful
test('works with an access token', async (t) => {
  const accessToken = {
    token: {
      access_token: 'token',
    },
  };
  const permanent = new Permanent({
    accessToken,
  });

  t.truthy(permanent);
  t.is(permanent.getAccessToken(), accessToken);
  t.is(permanent.getSessionToken(), null);
  t.is(permanent.getMfaToken(), null);
});
 */
