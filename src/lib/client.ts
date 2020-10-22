import { ApiService } from './api/api.service';
import { AuthResource } from './resources/auth.resource';

export interface PermanentConstructorConfigI {
  sessionToken: string;
  mfaToken: string;
  archiveId: number;
  apiKey: string;
}

export class Permanent {
  private apiKey: string;
  private sessionToken: string;
  private mfaToken: string;
  private archiveId: number;

  private api: ApiService;

  public auth: AuthResource;
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, archiveId, apiKey } = config;

    this.sessionToken = sessionToken;
    this.mfaToken = mfaToken;
    this.archiveId = archiveId;
    this.apiKey = apiKey;
    this.api = new ApiService(sessionToken, mfaToken, this.apiKey);
    this.auth = new AuthResource(this.api);
  }

  public getSessionToken() {
    return this.sessionToken;
  }

  public getMfaToken() {
    return this.mfaToken;
  }

  public getArchiveId() {
    return this.archiveId;
  }
}
