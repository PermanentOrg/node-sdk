import { AxiosStatic } from 'axios';

import { PermanentApiData, RequestVO } from '../model';

import { CsrfStore } from './csrf';

export const SESSION_COOKIE = 'permSession';
export const MFA_COOKIE = 'permMFA';

export interface PermanentApiRequestI {
  RequestVO: RequestVO;
}

export interface PermanentApiResponse {
  isSuccessful: boolean;
  isSystemUp: boolean;
  Results: { data: PermanentApiData[] }[];
  csrf: string;
  sessionId?: string;
}

export interface RepoConstructorConfig {
  sessionToken: string;
  mfaToken: string;
  csrfStore: CsrfStore;
  axios: AxiosStatic;
  apiKey: string;
  baseUrl?: string;
}

export class BaseRepo {
  private sessionToken = '';
  private mfaToken = '';
  private csrfStore: CsrfStore;
  private axios: AxiosStatic;
  private apiKey: string;
  private baseUrl = 'https://permanent.org/api';

  constructor(config: RepoConstructorConfig) {
    this.sessionToken = config.sessionToken;
    this.mfaToken = config.mfaToken;
    this.csrfStore = config.csrfStore;
    this.axios = config.axios;
    this.apiKey = config.apiKey;

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    }
  }

  async request(
    endpoint: string,
    data: PermanentApiData[] = [{}]
  ): Promise<PermanentApiResponse> {
    const requestData: PermanentApiRequestI = {
      RequestVO: {
        data,
        apiKey: this.apiKey,
        csrf: this.csrfStore.getCsrf(),
      },
    };
    const response = await this.axios.post(
      `${this.baseUrl}${endpoint}`,
      requestData,
      {
        headers: {
          Cookie: `${SESSION_COOKIE}=${this.sessionToken}; ${MFA_COOKIE}=${this.mfaToken};`,
        },
      }
    );

    if (response.data.csrf) {
      this.csrfStore.setCsrf(response.data.csrf);
    }

    return response.data;
  }
}
