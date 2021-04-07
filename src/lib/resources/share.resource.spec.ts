import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';

import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { AccessRole } from '../enum/access-role';
import { PermSdkError } from '../error';
import { ShareByUrlVO } from '../model';

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

  const vo: ShareByUrlVO = {
    shareUrl: expectedShareUrl,
    shareby_urlId: 1,
    folder_linkId,
    autoApproveToggle: 0,
    previewToggle: 0,
    defaultAccessRole: AccessRole.Viewer,
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            Shareby_urlVO: vo,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);
  sinon.replace(t.context.api.share, 'generateRecordShareLink', responseFake);

  const updateFake = sinon.fake.resolves(true);
  sinon.replace(t.context.share, 'updateShareLink', updateFake);

  const shareUrl = await t.context.share.createRecordShareLink({
    folder_linkId,
  });

  t.assert(updateFake.calledOnceWith(vo, true, true));
  t.is(shareUrl, expectedShareUrl);
});

test('should not update record share link preview and auto approve if set to false', async (t) => {
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
              autoApproveToggle: 0,
              previewToggle: 0,
              defaultAccessRole: AccessRole.Viewer,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);
  sinon.replace(t.context.api.share, 'generateRecordShareLink', responseFake);

  const updateFake = sinon.fake.resolves(true);
  sinon.replace(t.context.api.share, 'updateShareLink', updateFake);

  const shareUrl = await t.context.share.createRecordShareLink(
    {
      folder_linkId,
    },
    false,
    false
  );

  t.assert(updateFake.notCalled);
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

  const vo: ShareByUrlVO = {
    shareUrl: expectedShareUrl,
    shareby_urlId: 1,
    folder_linkId,
    autoApproveToggle: 0,
    previewToggle: 0,
  };

  const fakeResponse: PermanentApiResponse = {
    csrf: 'csrf',
    isSuccessful: true,
    isSystemUp: true,
    Results: [
      {
        data: [
          {
            Shareby_urlVO: vo,
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);
  sinon.replace(t.context.api.share, 'generateFolderShareLink', responseFake);

  const updateFake = sinon.fake.resolves(true);
  sinon.replace(t.context.share, 'updateShareLink', updateFake);

  const shareUrl = await t.context.share.createFolderShareLink({
    folder_linkId,
  });

  t.assert(updateFake.calledOnceWith(vo, true, true));
  t.is(shareUrl, expectedShareUrl);
});

test('should not update folder share link preview and auto approve if set to false', async (t) => {
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
              autoApproveToggle: 0,
              previewToggle: 0,
              defaultAccessRole: AccessRole.Viewer,
            },
          },
        ],
      },
    ],
  };
  const responseFake = sinon.fake.resolves(fakeResponse);
  sinon.replace(t.context.api.share, 'generateFolderShareLink', responseFake);

  const updateFake = sinon.fake.resolves(true);
  sinon.replace(t.context.api.share, 'updateShareLink', updateFake);

  const shareUrl = await t.context.share.createFolderShareLink(
    {
      folder_linkId,
    },
    false,
    false
  );

  t.assert(updateFake.notCalled);
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

test('should set proper values on vo from update share booleans', async (t) => {
  const defaultVo: ShareByUrlVO = {
    shareUrl: 'url',
    shareby_urlId: 1,
    folder_linkId: 1,
    autoApproveToggle: 0,
    previewToggle: 0,
    defaultAccessRole: AccessRole.Viewer,
  };

  const firstVo = { ...defaultVo };

  const responseFake = sinon.fake.resolves(true);
  sinon.replace(t.context.api.share, 'updateShareLink', responseFake);

  await t.context.share.updateShareLink(
    firstVo,
    true,
    true,
    AccessRole.Curator
  );

  t.assert(
    responseFake.calledOnceWith({
      ...firstVo,
      autoApproveToggle: 1,
      previewToggle: 1,
      defaultAccessRole: AccessRole.Curator,
    })
  );

  responseFake.resetHistory();

  const secondVo = { ...defaultVo };

  await t.context.share.updateShareLink(
    secondVo,
    false,
    true,
    AccessRole.Owner
  );
  t.assert(
    responseFake.calledOnceWith({
      ...secondVo,
      autoApproveToggle: 1,
      previewToggle: 0,
      defaultAccessRole: AccessRole.Owner,
    })
  );

  responseFake.resetHistory();
  const thirdVo: ShareByUrlVO = {
    ...defaultVo,
    previewToggle: 1,
    autoApproveToggle: 1,
  };

  await t.context.share.updateShareLink(thirdVo, false, false);
  t.assert(responseFake.calledOnceWith(thirdVo));
});
