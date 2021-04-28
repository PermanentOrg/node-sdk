import {
  FolderVO,
  PermanentApiRequestData,
  PermanentApiResponseData,
} from '../model';

import { BaseRepo } from './base.repo';

export type FolderResponse = PermanentApiResponseData<'FolderVO'>;

export class FolderRepo extends BaseRepo {
  public getRoot() {
    return this.request<FolderResponse>('/folder/getRoot');
  }

  public getAppRoot() {
    return this.request<FolderResponse>('/folder/getAppRoot');
  }

  public getWithChildren(rootFolderVO: FolderVO) {
    const requestData: PermanentApiRequestData = {
      FolderVO: rootFolderVO,
    };
    return this.request<FolderResponse>('/folder/getWithChildren', [
      requestData,
    ]);
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
