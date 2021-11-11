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

  public getPublicRoot() {
    return this.request<FolderResponse>('/folder/getPublicRoot');
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

  public copy(folderVOs: FolderVO[], destination: FolderVO) {
    const requestData: PermanentApiRequestData[] = folderVOs.map((folderVO) => {
      return {
        FolderVO: folderVO,
        FolderDestVO: {
          folder_linkId: destination.folder_linkId,
        },
      };
    });

    return this.request<FolderResponse>('/folder/copy', requestData);
  }
}
