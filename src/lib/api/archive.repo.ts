import { BaseRepo } from './base.repo';

export class ArchiveRepo extends BaseRepo {
  public get() {
    return this.request('/archive/get');
  }
}
