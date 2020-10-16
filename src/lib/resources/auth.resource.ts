import { BaseResource } from './base.resource';

export class AuthResource extends BaseResource {
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
        return response.Results[0].data[0].SimpleVO?.value === true
          ? true
          : false;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
