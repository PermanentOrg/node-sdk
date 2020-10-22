import { ApiService } from '../api/api.service';
import { PermSdkError } from '../error';

import { ArchiveStore } from './archive';
import { BaseResource } from './base.resource';

export class AuthResource extends BaseResource {
  constructor(public api: ApiService, public archiveStore: ArchiveStore) {
    super(api, archiveStore);
  }
  /**
   * Validates the credentials (`sessionToken`, `mfaToken`, etc.) used by the client instance
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   * if (await perm.auth.isSessionValid()) {
   *   // session is valid
   * } else {
   *   // session is invalid
   * }
   * ```
   *
   * @returns a Promise that resolves to a boolean representing whether or not the credentials are valid
   */
  public async isSessionValid(): Promise<boolean> {
    try {
      const response = await this.api.auth.isLoggedIn();
      if (response.isSuccessful) {
        return response.Results[0].data[0].SimpleVO?.value === true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  /**
   * Set the current client instance to use a given archive when making any subsequent requests.
   *
   * *Note: This is done automatically when creating a client instance.*
   *
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   * await perm.auth.useArchive(anotherArchiveNbr)
   * ```
   *
   * @returns a Promise that resolves to a boolean representing whether or not the credentials are valid
   */
  public async useArchive(archiveNbr: string): Promise<void> {
    const archiveResponse = await this.api.archive.change(archiveNbr);
    if (!archiveResponse.isSuccessful) {
      throw new PermSdkError(`Could not use archive ${archiveNbr}`);
    }

    const archive = archiveResponse.Results[0].data[0].ArchiveVO;

    if (archive !== undefined) {
      this.archiveStore.setArchive(archive);
    } else {
      throw new PermSdkError(`Could not use archive ${archiveNbr}`);
    }

    const getRootResponse = await this.api.folder.getRoot();

    if (!getRootResponse.isSuccessful) {
      throw new PermSdkError(
        `Could not get root folder for archive ${archiveNbr}`
      );
    }

    const rootFolder = getRootResponse.Results[0].data[0].FolderVO;

    if (rootFolder !== undefined) {
      this.archiveStore.setRoot(rootFolder);
    } else {
      throw new PermSdkError(
        `Could not get root folder for archive ${archiveNbr}`
      );
    }
  }
}
