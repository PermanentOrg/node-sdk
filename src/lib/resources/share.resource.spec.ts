import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermSdkError } from '../error';

import { ShareResource } from './share.resource';

const test = anyTest as TestInterface<{
  share: ShareResource;
  api: ApiService;
}>;

test.beforeEach((t) => {
  const api = new ApiService('session', 'mfa', 'test');
  t.context = {
    api,
    share: new ShareResource(api),
  };
});

test('should create', (t) => {
  t.assert(t.context.share);
});

test('should return the new share URL on successful record share link response', async (t) => {
  const expectedShareUrl = 'https://share.com';
  const folder_linkId = 1;

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            Shareby_urlVO: {
              shareUrl: expectedShareUrl,
              shareby_urlId: 1,
              folder_linkId,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.share, 'generateRecordShareLink', responseFake);

  const shareUrl = await t.context.share.createRecordShareLink({
    folder_linkId,
  });

  t.is(shareUrl, expectedShareUrl);
});

test('should throw error on unsuccessful record share link response', async (t) => {
  const folder_linkId = 1;
  const errorMessage = 'error.message';

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: false,
    isSystemUp: true,
    Results: [
      {
        data: [],
        message: [errorMessage],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.share, 'generateRecordShareLink', responseFake);

  const error = await t.throwsAsync(
    t.context.share.createRecordShareLink({
      folder_linkId,
    })
  );

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes(errorMessage));
});

test('should return the new share URL on successful folder share link response', async (t) => {
  const expectedShareUrl = 'https://share.com';
  const folder_linkId = 1;

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            Shareby_urlVO: {
              shareUrl: expectedShareUrl,
              shareby_urlId: 1,
              folder_linkId,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.share, 'generateFolderShareLink', responseFake);

  const shareUrl = await t.context.share.createFolderShareLink({
    folder_linkId,
  });

  t.is(shareUrl, expectedShareUrl);
});

test('should throw error on unsuccessful folder share link response', async (t) => {
  const folder_linkId = 1;
  const errorMessage = 'error.message';

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: false,
    isSystemUp: true,
    Results: [
      {
        data: [],
        message: [errorMessage],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);

  sinon.replace(t.context.api.share, 'generateFolderShareLink', responseFake);

  const error = await t.throwsAsync(
    t.context.share.createFolderShareLink({
      folder_linkId,
    })
  );

  t.assert(error instanceof PermSdkError);
  t.assert(error.message.includes(errorMessage));
});
