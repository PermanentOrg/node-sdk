import {PermanentApiResponseData } from '../model';

import { BaseRepo } from './base.repo';

export type AccountVOResponse = PermanentApiResponseData<'AccountVO'>;

export class AccountRepo extends BaseRepo {
  public getSessionAccount() {
    return this.request<AccountVOResponse>('/account/getsessionaccount');
  }
}
