import Joi from 'joi';

import { ApiService } from './api/api.service';
import { ArchiveStore } from './resources/archive';
import { FolderResource } from './resources/folder.resource';
import { ItemResource } from './resources/item.resource';
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

const schema = Joi.object({
  sessionToken: Joi.string().required(),
  mfaToken: Joi.string().required(),
  archiveId: Joi.number().optional(),
  archiveNbr: Joi.string().optional(),
  baseUrl: Joi.string().optional(),
});

export class Permanent {
  private sessionToken: string;
  private mfaToken: string;
  private archiveId?: number;
  private archiveNbr?: string;

  public api: ApiService;

  public folder: FolderResource;
  public item: ItemResource;
  public record: RecordResource;
  public session: SessionResource;
  public share: ShareResource;

  public archiveStore = new ArchiveStore();
  constructor(config: PermanentConstructorConfigI) {
    Joi.assert(
      config,
      schema,
      '@permanentorg/node-sdk: Invalid configuration',
      { abortEarly: false }
    );

    const { sessionToken, mfaToken, archiveId, archiveNbr, baseUrl } = config;

    this.sessionToken = sessionToken;
    this.mfaToken = mfaToken;
    this.archiveId = archiveId;
    this.archiveNbr = archiveNbr;
    this.api = ApiService.fromSession(sessionToken, mfaToken, baseUrl);
    this.folder = new FolderResource(this.api, this.archiveStore);
    this.record = new RecordResource(this.api, this.archiveStore);
    this.item = new ItemResource(this.folder, this.record);
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
