import { AxiosInstance } from 'axios';

import {
  PermanentApiRequestData,
  PermanentApiResponseDataBase,
  RequestVO,
} from '../model';

import { CsrfStore } from './csrf';

export interface PermanentApiRequest {
  RequestVO: RequestVO;
}

export interface PermanentApiResponse<T = PermanentApiResponseDataBase> {
  isSuccessful: boolean;
  isSystemUp: boolean;
  Results: { data: T[]; message?: string[] }[];
  csrf: string;
  sessionId?: string;
}
export interface RepoConstructorConfig {
  csrfStore: CsrfStore;
  axiosInstance: AxiosInstance;
  apiKey: string;
}

export class BaseRepo {
  private csrfStore: CsrfStore;
  private axiosInstance: AxiosInstance;
  private apiKey: string;

  constructor(config: RepoConstructorConfig) {
    this.csrfStore = config.csrfStore;
    this.axiosInstance = config.axiosInstance;
    this.apiKey = config.apiKey;
  }

  async request<
    T extends PermanentApiResponseDataBase = PermanentApiResponseDataBase
  >(
    endpoint: string,
    data: PermanentApiRequestData[] = [{}]
  ): Promise<PermanentApiResponse<T>> {
    const requestBody: PermanentApiRequest = {
      RequestVO: {
        apiKey: this.apiKey,
        csrf: this.csrfStore.getCsrf(),
        data,
      },
    };
    const response = await this.axiosInstance.post(endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (response.data.csrf) {
      this.csrfStore.setCsrf(response.data.csrf);
    }

    return response.data;
  }
}
