import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { Permanent, PermanentConstructorConfigI } from './client';
import { PermSdkError } from './error';

const test = anyTest as TestInterface<{
  permanent: Permanent;
  options: PermanentConstructorConfigI;
}>;

test.beforeEach((t) => {
  const options: PermanentConstructorConfigI = {
    apiKey: 'apiapiapi',
    sessionToken: 'sessionsessionsession',
    mfaToken: 'mfamfamfa',
    archiveNbr: '0001-0000',
  };
  t.context = {
    options,
    permanent: new Permanent(options),
  };
});

test('instance gets config options', (t) => {
  t.truthy(t.context.permanent);
  t.is(t.context.permanent.getSessionToken(), t.context.options.sessionToken);
  t.is(t.context.permanent.getMfaToken(), t.context.options.mfaToken);
  t.is(t.context.permanent.getArchiveNbr(), t.context.options.archiveNbr);
});

test('init method switches to proper archive', async (t) => {
  const changeFake = sinon.fake.resolves(true);
  sinon.replace(t.context.permanent.auth, 'useArchive', changeFake);

  await t.context.permanent.init();

  t.assert(changeFake.calledOnceWith(t.context.options.archiveNbr));
});

test('throws error for missing apiKey', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ apiKey: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes('apiKey'));
});

test('throws error for missing sessionToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ sessionToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes('sessionToken'));
});

test('throws error for missing mfaToken', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ mfaToken: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes('mfaToken'));
});

test('throws error for missing archiveNbr', async (t) => {
  const error = t.throws(() => {
    new Permanent(({
      ...t.context.options,
      ...{ archiveNbr: undefined },
    } as unknown) as PermanentConstructorConfigI);
  });

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes('archiveNbr'));
});
