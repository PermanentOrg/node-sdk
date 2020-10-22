import test from 'ava';

import { Permanent, PermanentConstructorConfigI } from './client';

test('instance gets config options', (t) => {
  const clientOptions: PermanentConstructorConfigI = {
    apiKey: 'apiapiapi',
    sessionToken: 'sessionsessionsession',
    mfaToken: 'mfamfamfa',
    archiveNbr: '0001-0000',
  };

  const client = new Permanent(clientOptions);

  t.truthy(client);
  t.is(client.getSessionToken(), clientOptions.sessionToken);
  t.is(client.getMfaToken(), clientOptions.mfaToken);
  t.is(client.getArchiveNbr(), clientOptions.archiveNbr);
});
