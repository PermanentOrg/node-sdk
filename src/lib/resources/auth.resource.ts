import { BaseResource } from './base.resource';

export class AuthResource extends BaseResource {
  public async isLoggedIn(): Promise<boolean> {
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
