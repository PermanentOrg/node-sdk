import axios from 'axios';

import { ArchiveRepo } from './archive.repo';
import { AuthRepo } from './auth.repo';
import { RepoConstructorConfig } from './base.repo';
import { CsrfStore } from './csrf';

export const SESSION_COOKIE = 'permSession';
export const MFA_COOKIE = 'permMFA';

export class ApiService {
  private csrfStore = new CsrfStore();
  private axiosInstance = axios.create();

  private repoConfig: RepoConstructorConfig = {
    csrfStore: this.csrfStore,
    axiosInstance: this.axiosInstance,
    apiKey: this.apiKey,
  };

  public auth = new AuthRepo(this.repoConfig);
  public archive = new ArchiveRepo(this.repoConfig);

  constructor(
    sessionToken: string,
    mfaToken: string,
    private apiKey: string,
    baseUrl = 'https://permanent.org/api'
  ) {
    this.axiosInstance.defaults.headers = createDefaultHeaders(
      sessionToken,
      mfaToken
    );
    this.axiosInstance.defaults.baseURL = baseUrl;
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}

function createDefaultHeaders(sessionToken: string, mfaToken: string) {
  return {
    Cookie: `${SESSION_COOKIE}=${sessionToken}; ${MFA_COOKIE}=${mfaToken};`,
  };
}
