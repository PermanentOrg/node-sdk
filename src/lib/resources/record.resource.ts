import { ApiService } from '../api/api.service';
import { SimpleVOResponse } from '../api/auth.repo';
import { BillingResponse } from '../api/billing.repo';
import { RecordResponse } from '../api/record.repo';
import { PermSdkError } from '../error';
import { ParentFolderVO, RecordVO, RecordVOFromUrl } from '../model';

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

  public async getPresignedUrl(fileType: string, record: RecordVO) {
    const response = await this.api.record.getPresignedUrl(fileType, record);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'could not get presigned url',
        response.Results[0].message
      );
    }
    return this.getVoFromResponse<SimpleVOResponse>(response, 'SimpleVO');
  }

  public async registerRecordAndAddStorage(record: RecordVO, s3url: string) {
    const response = await this.api.record.registerRecord(record, s3url);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'record could not be registered',
        response.Results[0].message
      );
    }
    const returnedRecord = this.getVoFromResponse<RecordResponse>(response, 'RecordVO');
    const accountResponse = await this.api.account.getSessionAccount();
    if (!accountResponse.isSuccessful) {
      throw new PermSdkError(
        'could not get the session account',
        response.Results[0].message
      );
    }
    const account = accountResponse.Results[0].data[0].AccountVO;
    // We have to use the size reported by the client, because at this
    // point in processing the server-side record does not yet have a size
    const billingResponse = await this.api.billing.addStorage(
      account.accountId,
      record.size
    );
    if (!billingResponse.isSuccessful) {
      throw new PermSdkError(
        'failed to add storage',
        response.Results[0].message
      );
    }
    return returnedRecord;

  }
}
