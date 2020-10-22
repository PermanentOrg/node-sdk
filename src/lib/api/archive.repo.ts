import { PermanentApiRequestData } from '../model';

import { BaseRepo } from './base.repo';

export class ArchiveRepo extends BaseRepo {
  public getByArchiveNbr(archiveNbr: string) {
    const requestData: PermanentApiRequestData = {
      ArchiveVO: {
        archiveNbr,
      },
    };
    return this.request('/archive/getByArchiveNbr', [requestData]);
  }

  public change(archiveNbr: string) {
    const requestData: PermanentApiRequestData = {
      ArchiveVO: {
        archiveNbr,
      },
    };
    return this.request('/archive/change', [requestData]);
  }
}
