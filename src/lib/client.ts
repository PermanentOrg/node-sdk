import { ApiService } from './api/api.service';
import { AuthResource } from './resources/auth.resource';

export interface PermanentConstructorConfigI {
  sessionToken: string;
  mfaToken: string;
  accountId: number;
  archiveId: number;
}

export class Permanent {
  private apiKey = 'Xr$k?fopgA"FdWFoPKmmh6n7';
  private sessionToken: string | undefined;
  private mfaToken: string | undefined;
  private accountId: number | undefined;
  private archiveId: number | undefined;

  private api: ApiService;

  public auth: AuthResource;
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, accountId, archiveId } = config;
    Object.assign(this, { sessionToken, mfaToken, accountId, archiveId });
    this.api = new ApiService(sessionToken, mfaToken, this.apiKey);

    this.auth = new AuthResource(this.api);
  }

  public getSessionToken() {
    return this.sessionToken;
  }

  public getMfaToken() {
    return this.mfaToken;
  }

  public getAccountId() {
    return this.accountId;
  }

  public getArchiveId() {
    return this.archiveId;
  }
}
