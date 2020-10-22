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

  private archiveStore = new ArchiveStore();
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, archiveNbr, apiKey } = config;

    this.sessionToken = sessionToken;
    this.mfaToken = mfaToken;
    this.archiveNbr = archiveNbr;
    this.apiKey = apiKey;

    this.api = new ApiService(sessionToken, mfaToken, this.apiKey);

    this.auth = new AuthResource(this.api, this.archiveStore);
  }

  public async init() {
    await this.auth.useArchive(this.archiveNbr);
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
