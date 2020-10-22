import anyTest, { TestInterface } from 'ava';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { PermanentApiData } from '../model';

import { BaseRepo, PermanentApiRequest } from './base.repo';
import { CsrfStore } from './csrf';

const test = anyTest as TestInterface<{
  baseRepo: BaseRepo;
  csrfStore: CsrfStore;
  mockAxios: MockAdapter;
}>;
const baseUrl = 'http://test.com';
const apiKey = 'apiKey';

test.beforeEach('New BaseRepo', (t) => {
  const csrfStore = new CsrfStore();
  const axiosInstance = axios.create({
    baseURL: baseUrl,
  });

  const mockAxios = new MockAdapter(axiosInstance);

  t.context = {
    csrfStore,
    mockAxios,
    baseRepo: new BaseRepo({
      csrfStore,
      axiosInstance,
      apiKey,
    }),
  };
});

test('requests are made using API key', async (t) => {
  const endpoint = '/endpoint';

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequest;
    t.is(requestData.RequestVO.apiKey, apiKey);
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint);
});

test('requests are made using csrf from CsrfStore', async (t) => {
  const endpoint = '/endpoint';

  t.context.csrfStore.setCsrf('testCsrf');
  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequest;
    t.is(requestData.RequestVO.csrf, t.context.csrfStore.getCsrf());
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint);
});

test('CsrfStore is updated with csrf from response', async (t) => {
  const newCsrf = 'newcsrf';
  const endpoint = '/endpoint';
  t.context.csrfStore.setCsrf('oldcsrf');
  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce(() => {
    return [200, { csrf: newCsrf }];
  });

  await t.context.baseRepo.request(endpoint);

  t.is(t.context.csrfStore.getCsrf(), newCsrf);
});

test('requests are made with provided data', async (t) => {
  const data: PermanentApiData[] = [{ FolderVO: { folderId: 1, folder_linkId: 2 } }];
  const endpoint = '/endpoint';

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const requestData = JSON.parse(config.data) as PermanentApiRequest;
    t.deepEqual(requestData.RequestVO.data, data);
    return [200, {}];
  });

  await t.context.baseRepo.request(endpoint, data);
});
