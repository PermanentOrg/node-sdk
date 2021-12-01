import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

import { AccountRepo } from './account.repo';
import { ArchiveRepo } from './archive.repo';
import { AuthRepo } from './auth.repo';
import { RepoConstructorConfig } from './base.repo';
import { CsrfStore } from './csrf';
import { FolderRepo } from './folder.repo';
import { RecordRepo } from './record.repo';
import { ShareRepo } from './share.repo';

export const SESSION_COOKIE = 'permSession';
export const MFA_COOKIE = 'permMFA';

export class ApiService {
  private csrfStore = new CsrfStore();
  private axiosInstance = axios.create();

  private repoConfig: RepoConstructorConfig = {
    csrfStore: this.csrfStore,
    axiosInstance: this.axiosInstance,
  };

  public account = new AccountRepo(this.repoConfig);
  public archive = new ArchiveRepo(this.repoConfig);
  public auth = new AuthRepo(this.repoConfig);
  public folder = new FolderRepo(this.repoConfig);
  public record = new RecordRepo(this.repoConfig);
  public share = new ShareRepo(this.repoConfig);

  private constructor(defaultConfig: AxiosRequestConfig) {
    Object.assign(this.axiosInstance.defaults, defaultConfig);
  }

  public static fromSession(
    sessionToken: string,
    mfaToken: string,
    baseURL = 'https://www.permanent.org/api'
  ) {
    return new ApiService({
      baseURL,
      headers: {
        Cookie: `${SESSION_COOKIE}=${sessionToken}; ${MFA_COOKIE}=${mfaToken};`,
      },
    });
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}
