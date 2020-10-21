import { PermanentApiData } from '../model';
import { ArchiveVO } from '../model/archive-vo';

import { BaseRepo } from './base.repo';

export class ArchiveRepo extends BaseRepo {
  public change(archive: ArchiveVO) {
    const requestData: PermanentApiData = {
      ArchiveVO: archive,
    };
    return this.request('/archive/change', [requestData]);
  }
}
