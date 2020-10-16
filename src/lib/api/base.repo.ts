import { AxiosInstance } from 'axios';

import { PermanentApiData, RequestVO } from '../model';

import { CsrfStore } from './csrf';

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
    const response = await this.axiosInstance.post(endpoint, requestData);

    if (response.data.csrf) {
      this.csrfStore.setCsrf(response.data.csrf);
    }

    return response.data;
  }
}
