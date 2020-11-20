import { ApiService } from '../api/api.service';
import { ArchiveResponse } from '../api/archive.repo';
import { PermSdkError } from '../error';

import { ArchiveStore } from './archive';
import { BaseResource } from './base.resource';
/**
 * `Resource` that manages any exposed auth and session state methods for the client instance.
 *
 * This includes things such as:
 * - validating the credentials and session
 * - setting which archive is currently in use by the client instance
 */
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
        return response.Results[0].data[0].SimpleVO.value === true;
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
   * *Note: This is done automatically when calling `perm.init()`*
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
    const isLoggedIn = await this.isSessionValid();
    if (!isLoggedIn) {
      throw new PermSdkError(`Credentials invalid`);
    }

    const archiveResponse = await this.api.archive.change(archiveNbr);
    if (!archiveResponse.isSuccessful) {
      throw new PermSdkError(
        `Could not use archive ${archiveNbr}`,
        this.getMessageFromResponse(archiveResponse)
      );
    }

    const archive = this.getVoFromResponse<ArchiveResponse>(
      archiveResponse,
      'ArchiveVO'
    );

    this.archiveStore.setArchive(archive);
  }
}
