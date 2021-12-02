import Joi from 'joi';
import type { AccessToken } from 'simple-oauth2';

import { ApiService } from './api/api.service';
import { ArchiveStore } from './resources/archive';
import { FolderResource } from './resources/folder.resource';
import { ItemResource } from './resources/item.resource';
import { RecordResource } from './resources/record.resource';
import { SessionResource } from './resources/session.resource';
import { ShareResource } from './resources/share.resource';

export interface PermanentConstructorConfigI {
  sessionToken?: string;
  mfaToken?: string;
  accessToken?: AccessToken;
  archiveId?: number;
  archiveNbr?: string;
  baseUrl?: string;
}

const schema = Joi.object({
  sessionToken: Joi.string().optional(),
  mfaToken: Joi.string().optional(),
  accessToken: Joi.object().optional(),
  archiveId: Joi.number().optional(),
  archiveNbr: Joi.string().optional(),
  baseUrl: Joi.string().optional(),
})
  .and('sessionToken', 'mfaToken')
  .xor('sessionToken', 'accessToken');

export class Permanent {
  private sessionToken?: string;
  private mfaToken?: string;
  private accessToken?: AccessToken;
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

    const { archiveId, archiveNbr, baseUrl } = config;

    if ('sessionToken' in config) {
      this.sessionToken = config.sessionToken;
      this.mfaToken = config.mfaToken;
      this.api = ApiService.fromSession(
        config.sessionToken!,
        config.mfaToken!,
        baseUrl
      );
    } else {
      this.accessToken = config.accessToken!;
      this.api = ApiService.fromToken(this.accessToken, baseUrl);
    }

    this.archiveId = archiveId;
    this.archiveNbr = archiveNbr;
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

  public getAccessToken() {
    return this.accessToken;
  }

  public getArchiveNbr() {
    return this.archiveNbr;
  }

  public getArchiveId() {
    return this.archiveId;
  }
}
