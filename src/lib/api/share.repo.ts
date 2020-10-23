import { PermanentApiRequestData } from '../model';

import { BaseRepo } from './base.repo';

export class ShareRepo extends BaseRepo {
  public generateShareLink(folder_linkId: number, forFolder = false) {
    const requestData: PermanentApiRequestData = {};

    if (forFolder) {
      requestData.FolderVO = { folder_linkId };
    } else {
      requestData.RecordVO = { folder_linkId };
    }

    return this.request('/share/generateShareLink', [requestData]);
  }
}
