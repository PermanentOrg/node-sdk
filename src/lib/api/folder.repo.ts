import { PermanentApiRequestData, PermanentApiResponseData } from '../model';

import { BaseRepo } from './base.repo';

export type FolderResponse = PermanentApiResponseData<'FolderVO'>;

export class FolderRepo extends BaseRepo {
  public getRoot() {
    return this.request<FolderResponse>('/folder/getRoot');
  }

  public post(
    displayName: string,
    parentFolderId: number,
    parentFolder_linkId: number
  ) {
    const requestData: PermanentApiRequestData = {
      FolderVO: {
        displayName,
        parentFolderId,
        parentFolder_linkId,
      },
    };

    return this.request<FolderResponse>('/folder/post', [requestData]);
  }
}
