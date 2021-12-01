import test from 'ava';

import { PermSdkError } from './error';

const packageName = '@permanentorg/node-sdk';

test('should have the given message prefixed with the package name', (t) => {
  const message = 'my message';
  const error = new PermSdkError(message);
  t.assert(error.message.includes(packageName));
  t.assert(error.message.includes(message));
});

test('should have the given message along with API errors, prefixed with the package name', (t) => {
  const message = 'my message';
  const apiError = 'error.message';
  const error = new PermSdkError(message, [apiError]);
  t.assert(error.message.includes(packageName));
  t.assert(error.message.includes(message));
  t.assert(error.message.includes(apiError));
});
