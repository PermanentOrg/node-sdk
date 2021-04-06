import { PermanentApiRequestData, PermanentApiResponseData } from '../model';

import { BaseRepo } from './base.repo';

export type ArchiveResponse = PermanentApiResponseData<'ArchiveVO'>;

export class ArchiveRepo extends BaseRepo {
  public getByArchiveNbr(archiveNbr: string) {
    const requestData: PermanentApiRequestData = {
      ArchiveVO: {
        archiveNbr,
      },
    };
    return this.request<ArchiveResponse>('/archive/getByArchiveNbr', [
      requestData,
    ]);
  }

  public getDefaultArchive(archiveId: number) {
    const requestData: PermanentApiRequestData = {
      ArchiveVO: {
        archiveId,
      }
    };

    return this.request<ArchiveResponse>('archive/getbyarchiveid', [requestData]);
  }

  public change(archiveNbr: string) {
    const requestData: PermanentApiRequestData = {
      ArchiveVO: {
        archiveNbr,
      },
    };

    return this.request<ArchiveResponse>('/archive/change', [requestData]);
  }
}
