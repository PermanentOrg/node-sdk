import { ApiService } from '../api/api.service';
import { FolderVO } from '../model';

import { ArchiveStore } from './archive';
import { BaseResource } from './base.resource';

export class FolderResource extends BaseResource {
  constructor(public api: ApiService, public archiveStore: ArchiveStore) {
    super(api, archiveStore);
  }

  public async create(
    name: string,
    parentFolder: Pick<
      FolderVO,
      'folder_linkId'
    > = this.archiveStore.getPrivateRoot()
  ): Promise<any> {
    console.log(name);
    return parentFolder;
  }
}
