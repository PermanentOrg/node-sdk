import { BaseRepo } from './base.repo';

export class AuthRepo extends BaseRepo {
  public isLoggedIn() {
    return this.request('/auth/loggedIn');
  }
}
