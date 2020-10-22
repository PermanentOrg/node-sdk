import { PermanentApiRequestData } from '../model';

import { BaseRepo } from './base.repo';

export class FolderRepo extends BaseRepo {
  public getRoot() {
    return this.request('/folder/getRoot');
  }

  public post(displayName: string, parentFolderId: number, parentFolder_linkId: number) {
    const requestData: PermanentApiRequestData = {
      FolderVO: {
        displayName,
        parentFolderId,
        parentFolder_linkId
      },
    };

    return this.request('/folder/post', [requestData]);
  }
}
