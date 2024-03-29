import anyTest, { TestFn } from 'ava';
import { AuthorizationCode } from 'simple-oauth2';

import { Permanent, PermanentConstructorConfigI } from './client';

const test = anyTest as TestFn<{
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
  t.is(permanent.getAccessToken(), undefined);
});

test('throws error for missing sessionToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ sessionToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error !== undefined && error.message.includes('sessionToken'));
});

test('throws error for missing mfaToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ mfaToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error !== undefined && error.message.includes('mfaToken'));
});

test('throws error for missing authentication', async (t) => {
  const error = t.throws(() => {
    new Permanent({});
  });

  t.assert(error !== undefined && error.message.includes('at least one of'));
  t.assert(error !== undefined && error.message.includes('accessToken'));
  t.assert(error !== undefined && error.message.includes('sessionToken'));
});

test('works with an access token', async (t) => {
  const client = new AuthorizationCode({
    client: { id: 'id', secret: 'secret' },
    auth: { tokenHost: 'http://example.com' },
  });
  const accessToken = client.createToken({
    access_token: 'token',
    expires_in: 123,
    token_type: 'Bearer',
  });
  const permanent = new Permanent({
    accessToken,
  });

  t.truthy(permanent);
  t.is(permanent.getAccessToken(), accessToken);
  t.is(permanent.getSessionToken(), undefined);
  t.is(permanent.getMfaToken(), undefined);
});
