import anyTest, { TestInterface } from 'ava';
import MockAdapter from 'axios-mock-adapter';

import { ApiService, MFA_COOKIE, SESSION_COOKIE } from './api.service';

const test = anyTest as TestInterface<{
  apiService: ApiService;
  mockAxios: MockAdapter;
}>;

const sessionToken = 'sessionToken';
const mfaToken = 'mfaToken';
const baseUrl = 'http://baseurl.com';

test.beforeEach('New ApiService', (t) => {
  const apiService = ApiService.fromSession(sessionToken, mfaToken, baseUrl);
  const mockAxios = new MockAdapter(apiService.getAxiosInstance());

  t.context = {
    mockAxios,
    apiService,
  };
});

test('requests are made relative to baseUrl, and with session and mfa cookies set', async (t) => {
  const endpoint = '/endpoint';
  const axiosInstance = t.context.apiService.getAxiosInstance();

  t.context.mockAxios.onPost(`${baseUrl}${endpoint}`).replyOnce((config) => {
    const cookies = config.headers.Cookie;
    t.assert(cookies.includes(`${SESSION_COOKIE}=${sessionToken}`));
    t.assert(cookies.includes(`${MFA_COOKIE}=${mfaToken}`));
    return [200, {}];
  });

  await axiosInstance.post(endpoint);
});
