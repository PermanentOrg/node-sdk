import { ApiService } from './api/api.service';
import { ArchiveStore } from './resources/archive';
import { AuthResource } from './resources/auth.resource';

export interface PermanentConstructorConfigI {
  sessionToken: string;
  mfaToken: string;
  archiveNbr: string;
  apiKey: string;
}

export class Permanent {
  private apiKey: string;
  private sessionToken: string;
  private mfaToken: string;
  private archiveNbr: string;

  private api: ApiService;

  public auth: AuthResource;

  private archiveStore: ArchiveStore;
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, archiveNbr, apiKey } = config;

    this.sessionToken = sessionToken;
    this.mfaToken = mfaToken;
    this.archiveNbr = archiveNbr;
    this.apiKey = apiKey;
    this.api = new ApiService(sessionToken, mfaToken, this.apiKey);
    this.archiveStore = new ArchiveStore(this.api);
    this.auth = new AuthResource(this.api);
  }

  public getSessionToken() {
    return this.sessionToken;
  }

  public getMfaToken() {
    return this.mfaToken;
  }

  public getArchiveNbr() {
    return this.archiveNbr;
  }
}
