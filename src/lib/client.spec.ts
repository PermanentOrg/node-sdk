import anyTest, { TestInterface } from 'ava';

import { Permanent, PermanentConstructorConfigI } from './client';
import { PermSdkError } from './error';

const test = anyTest as TestInterface<{
  permanent: Permanent;
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
    permanent: new Permanent(options),
  };
});

test('instance gets config options', (t) => {
  t.truthy(t.context.permanent);
  t.is(t.context.permanent.getSessionToken(), t.context.options.sessionToken);
  t.is(t.context.permanent.getMfaToken(), t.context.options.mfaToken);
  t.is(t.context.permanent.getArchiveNbr(), t.context.options.archiveNbr);
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
