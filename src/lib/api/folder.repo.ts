import { BaseRepo } from './base.repo';

export class FolderRepo extends BaseRepo {
  public getRoot() {
    return this.request('/folder/getRoot');
  }
}
