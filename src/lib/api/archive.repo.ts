import { BaseRepo } from './base.repo';

export class ArchiveRepo extends BaseRepo {
  public change() {
    return this.request('/auth/loggedIn');
  }
}
