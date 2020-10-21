import { PermanentApiData } from '../model';

import { BaseRepo } from './base.repo';

export class ArchiveRepo extends BaseRepo {
  public getByArchiveNbr(archiveNbr: string) {
    const requestData: PermanentApiData = {
      ArchiveVO: {
        archiveNbr,
      },
    };
    return this.request('/archive/getByArchiveNbr', [requestData]);
  }

  public change(archiveNbr: string) {
    const requestData: PermanentApiData = {
      ArchiveVO: {
        archiveNbr,
      },
    };
    return this.request('/archive/change', [requestData]);
  }
}
