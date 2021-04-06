import { ApiService } from '../api/api.service';
import { FolderResponse } from '../api/folder.repo';
import { PermSdkError } from '../error';
import { FolderVO, ParentFolderVO } from '../model';

import { ArchiveStore } from './archive';
import { BaseResource } from './base.resource';

export class FolderResource extends BaseResource {
  constructor(public api: ApiService, public archiveStore: ArchiveStore) {
    super(api, archiveStore);
  }

  /**
   * Creates a folder in the current archive
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   * const parentFolder = { folder_linkId: 50 };
   *
   * const newFolder = await perm.folder.create(
   *   "Folder Name",
   *   parentFolder // or leave unspecified to upload to the private root
   * )
   * ```
   *
   * @returns a Promise that resolves to the newly created folder
   */
  public async create(
    displayName: string,
    parentFolder: ParentFolderVO = this.archiveStore.getPrivateRoot()
  ): Promise<FolderVO> {
    const response = await this.api.folder.post(
      displayName,
      parentFolder.folder_linkId
    );

    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Folder could not be created!',
        this.getMessageFromResponse(response)
      );
    }

    return this.getVoFromResponse<FolderResponse>(response, 'FolderVO');
  }

  public async getAppFolders(): Promise<FolderVO[]> {
    const appRoot = await this.api.folder.getAppRoot();
    const response = await this.api.folder.getWithChildren(appRoot.Results[0].data[0].FolderVO);
    return this.getVosFromResponse<FolderResponse>(response, 'FolderVO');
  }
}
