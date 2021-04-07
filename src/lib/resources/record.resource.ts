import { ApiService } from '../api/api.service';
import { BillingResponse } from '../api/billing.repo';
import { RecordResponse } from '../api/record.repo';
import { PermSdkError } from '../error';
import { ParentFolderVO, RecordVOFromUrl } from '../model';

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
   * const parentFolder = { folder_linkId: 50 };
   *
   * const record = await perm.record.uploadFromUrl(
   *   {
   *     displayName: 'Visible name in the system',
   *     uploadFileName: 'actual_file_name.jpg',
   *     uploadUri: 'https://www.myfile.com/images/3093400210'
   *   },
   *   parentFolder // or leave unspecified to upload to the private root
   * )
   * ```
   *
   * @returns a Promise that resolves to the newly created record
   */
  public async uploadFromUrl(
    fileData: Omit<RecordVOFromUrl, 'status' | 'parentFolder_linkId'>,
    parentFolder: ParentFolderVO = this.archiveStore.getPrivateRoot()
  ) {
    const parentFolder_linkId = parentFolder.folder_linkId;

    const response = await this.api.record.post(
      fileData.displayName,
      fileData.uploadFileName,
      fileData.uploadUri,
      parentFolder_linkId,
      fileData.description
    );

    if (!response.isSuccessful) {
      throw new PermSdkError(
        'record could not be created',
        response.Results[0].message
      );
    }

    return this.getVoFromResponse<RecordResponse>(response, 'RecordVO');
  }

  public async addStorage(recordId: number) {
    const accountResponse = await this.api.account.getSessionAccount();
    const account = accountResponse.Results[0].data[0].AccountVO;
    const recordResponse = await this.api.record.getById(recordId);
    const record = recordResponse.Results[0].data[0].RecordVO;
    // the record initially does not have a size, so adding this in for testing
    record.size = 98894;
    const billingResponse = await this.api.billing.addStorage(
      account.accountId,
      record.size
    );
    return this.getVoFromResponse<BillingResponse>(
      billingResponse,
      'LedgerNonfinancialVO'
    );
  }
}
