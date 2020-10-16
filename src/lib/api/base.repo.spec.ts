import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { PermanentApiData } from '../model';

import {
  BaseRepo,
  MFA_COOKIE,
  PermanentApiRequestI,
  SESSION_COOKIE,
} from './base.repo';
import { CsrfStore } from './csrf';

const test = anyTest as TestInterface<{
  baseRepo: BaseRepo;
  csrfStore: CsrfStore;
  mockAxios: MockAdapter;
}>;
const baseUrl = 'http://test.com';
const apiKey = 'apiKey';
const sessionToken = 'sessionToken';
const mfaToken = 'mfaToken';

test.beforeEach('New BaseRepo', (t) => {
  const csrfStore = new CsrfStore();
  const mockAxios = new MockAdapter(axios);

  t.context = {
    csrfStore,
    mockAxios,
    baseRepo: new BaseRepo({
      sessionToken,
      mfaToken,
      csrfStore,
      axios,
      apiKey,
      baseUrl,
    }),
  };
});

test.serial('requests are made using API key', async (t) => {
  const endpoint = '/endpoint';

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequestI;
    t.is(requestData.RequestVO.apiKey, apiKey);
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint);
});

test.serial('requests are made using csrf from CsrfStore', async (t) => {
  const endpoint = '/endpoint';

  t.context.csrfStore.setCsrf('testCsrf');
  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequestI;
    t.is(requestData.RequestVO.csrf, t.context.csrfStore.getCsrf());
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint);
});

test.serial('CsrfStore is updated with csrf from response', async (t) => {
  const newCsrf = 'newcsrf';
  const endpoint = '/endpoint';
  t.context.csrfStore.setCsrf('oogabooga');
  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce(() => {
    return [200, { csrf: newCsrf }];
  });

  await t.context.baseRepo.request(endpoint);

  t.is(t.context.csrfStore.getCsrf(), newCsrf);
});

test.serial('requests are made with provided data', async (t) => {
  const data: PermanentApiData[] = [{ FolderVO: null }];
  const endpoint = '/endpoint';

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequestI;
    t.deepEqual(requestData.RequestVO.data, data);
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint, data);
});

test.serial('requests are made with session and mfa cookies set', async (t) => {
  const endpoint = '/endpoint';

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const cookies = config.headers.Cookie;
    t.assert(cookies.includes(`${SESSION_COOKIE}=${sessionToken}`));
    t.assert(cookies.includes(`${MFA_COOKIE}=${mfaToken}`));
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint);
});
