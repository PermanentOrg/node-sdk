import { PermanentApiRequestData, PermanentApiResponseData } from '../model';

import { BaseRepo } from './base.repo';

export type FolderResponse = PermanentApiResponseData<'FolderVO'>;

export class FolderRepo extends BaseRepo {
  public getRoot() {
    return this.request<FolderResponse>('/folder/getRoot');
  }

  public post(displayName: string, parentFolder_linkId: number) {
    const requestData: PermanentApiRequestData = {
      FolderVO: {
        displayName,
        parentFolder_linkId,
      },
    };

    return this.request<FolderResponse>('/folder/post', [requestData]);
  }
}
