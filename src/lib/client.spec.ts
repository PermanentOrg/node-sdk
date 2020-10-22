import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { Permanent, PermanentConstructorConfigI } from './client';

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
    permanent: new Permanent(options)
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