import { ApiService } from './api/api.service';
import { ArchiveStore } from './resources/archive';
import { AuthResource } from './resources/auth.resource';

export interface PermanentConstructorConfigI {
  sessionToken: string;
  mfaToken: string;
  accountId: number;
  archiveNbr: string;
}

export class Permanent {
  private apiKey = 'Xr$k?fopgA"FdWFoPKmmh6n7';
  private sessionToken: string | undefined;
  private mfaToken: string | undefined;
  private accountId: number | undefined;
  private archiveNbr: string | undefined;

  private api: ApiService;

  public auth: AuthResource;

  private archiveStore: ArchiveStore;
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, accountId, archiveNbr } = config;
    Object.assign(this, { sessionToken, mfaToken, accountId, archiveNbr });
    this.api = new ApiService(sessionToken, mfaToken, this.apiKey);
    this.archiveStore = new ArchiveStore(this.api);

    this.auth = new AuthResource(this.api, this.archiveStore);
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

  public getArchiveNbr() {
    return this.archiveNbr;
  }
}
