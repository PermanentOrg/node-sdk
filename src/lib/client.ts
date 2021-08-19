import { ApiService } from './api/api.service';
import { PermSdkError } from './error';
import { ArchiveStore } from './resources/archive';
import { FolderResource } from './resources/folder.resource';
import { RecordResource } from './resources/record.resource';
import { SessionResource } from './resources/session.resource';
import { ShareResource } from './resources/share.resource';

export interface PermanentConstructorConfigI {
  sessionToken: string;
  mfaToken: string;
  archiveId?: number;
  archiveNbr?: string;
  baseUrl?: string;
}

export class Permanent {
  private sessionToken: string;
  private mfaToken: string;
  private archiveId?: number;
  private archiveNbr?: string;

  public api: ApiService;

  public folder: FolderResource;
  public record: RecordResource;
  public session: SessionResource;
  public share: ShareResource;

  public archiveStore = new ArchiveStore();
  constructor(config: PermanentConstructorConfigI) {
    const { sessionToken, mfaToken, archiveId, archiveNbr, baseUrl } = config;

    if (!sessionToken) {
      throw new PermSdkError('Missing sessionToken in config');
    }

    if (!mfaToken) {
      throw new PermSdkError('Missing mfaToken in config');
    }

    this.sessionToken = sessionToken;
    this.mfaToken = mfaToken;
    this.archiveId = archiveId;
    this.archiveNbr = archiveNbr;
    this.api = new ApiService(sessionToken, mfaToken, baseUrl);
    this.folder = new FolderResource(this.api, this.archiveStore);
    this.record = new RecordResource(this.api, this.archiveStore);
    this.session = new SessionResource(this.api, this.archiveStore);
    this.share = new ShareResource(this.api);
  }

  public async init() {
    if (this.archiveNbr === undefined) {
      const archive = await this.session.getAccountArchive();
      // get the default archiveNbr from the account
      this.archiveNbr = archive.archiveNbr;
      this.archiveId = archive.archiveId;
    }
    await this.session.useArchive(this.archiveNbr);
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

  public getArchiveId() {
    return this.archiveId;
  }
}
