import { ApiService } from '../api/api.service';
import { RecordResponse } from '../api/record.repo';
import { PermSdkError } from '../error';
import { RecordVOFromUrl } from '../model';

import { ArchiveStore } from './archive';
import { BaseResource } from './base.resource';

export class RecordResource extends BaseResource {
  constructor(public api: ApiService, public archiveStore: ArchiveStore) {
    super(api, archiveStore);
  }

  /**
   * Uploads a file accessible from a public URL to the current archive
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   *
   * const record = await perm.record.uploadFromUrl({
   *   displayName: 'Visible name in the system',
   *   uploadFileName: 'actual_file_name.jpg',
   *   parentFolder_linkId: 50 // or leave unspecified to upload to the private root
   *   uploadUri: 'https://www.myfile.com/images/3093400210'
   * })
   * ```
   *
   * @returns a Promise that resolves to the newly created record
   */
  public async uploadFromUrl(fileData: Omit<RecordVOFromUrl, 'status'>) {
    const privateRoot = this.archiveStore.getPrivateRoot();
    const parentFolder_linkId =
      fileData.parentFolder_linkId || privateRoot.folder_linkId;

    const response = await this.api.record.post(
      fileData.displayName,
      fileData.uploadFileName,
      fileData.uploadUri,
      parentFolder_linkId
    );

    if (!response.isSuccessful) {
      throw new PermSdkError(
        'record could not be created',
        response.Results[0].message
      );
    }

    return this.getVoFromResponse<RecordResponse>(response, 'RecordVO');
  }
}