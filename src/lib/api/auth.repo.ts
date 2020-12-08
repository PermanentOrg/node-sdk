import { PermanentApiResponseData } from '../model';

import { BaseRepo } from './base.repo';

export type SimpleVOResponse = PermanentApiResponseData<'SimpleVO'>;

export class AuthRepo extends BaseRepo {
  public isLoggedIn() {
    return this.request<SimpleVOResponse>('/auth/loggedIn');
  }
}
