import test from 'ava';

import { Permanent, PermanentConstructorConfigI } from './client';

test('instance gets config options', (t) => {
  const clientOptions: PermanentConstructorConfigI = {
    sessionToken: 'googoogaga',
    mfaToken: 'mfamfamfa',
    accountId: 1,
    archiveNbr: '0001-0000',
  };

  const client = new Permanent(clientOptions);

  t.truthy(client);
  t.is(client.getSessionToken(), clientOptions.sessionToken);
  t.is(client.getMfaToken(), clientOptions.mfaToken);
  t.is(client.getAccountId(), clientOptions.accountId);
  t.is(client.getArchiveNbr(), clientOptions.archiveNbr);
});
