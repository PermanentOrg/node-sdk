import axios from 'axios';

import { AuthRepo } from './auth.repo';
import { RepoConstructorConfig } from './base.repo';
import { CsrfStore } from './csrf';

export class ApiService {
  private csrfStore = new CsrfStore();
  private axios = axios;

  private repoConfig: RepoConstructorConfig = {
    sessionToken: this.sessionToken,
    mfaToken: this.mfaToken,
    csrfStore: this.csrfStore,
    axios: this.axios,
    apiKey: this.apiKey,
    baseUrl: this.baseUrl,
  };

  public auth = new AuthRepo(this.repoConfig);

  constructor(
    private sessionToken: string,
    private mfaToken: string,
    private apiKey: string,
    private baseUrl = 'https://permanent.org/api'
  ) {}
}
