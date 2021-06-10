import { ApiService } from '../api/api.service';
import { SimpleVOResponse } from '../api/auth.repo';
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

  public async getPresignedUrl(
    fileType: string,
    record: RecordVO,
    padToken?: string
  ) {
    const response = await this.api.record.getPresignedUrl(
      fileType,
      record,
      padToken
    );
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'could not get presigned url',
        response.Results[0].message
      );
    }

    const presignedUrlResponse = this.getVoFromResponse<SimpleVOResponse>(
      response,
      'SimpleVO'
    );
    if (
      typeof presignedUrlResponse.value === 'object' &&
      'presignedPost' in presignedUrlResponse.value
    ) {
      return presignedUrlResponse.value;
    } else {
      throw new PermSdkError(
        'unexpected response type',
        response.Results[0].message
      );
    }
  }

  public async registerRecordAndAddStorage(
    record: RecordVO,
    s3url: string,
    padToken?: string
  ) {
    const response = await this.api.record.registerRecord(
      record,
      s3url,
      padToken
    );
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'record could not be registered',
        response.Results[0].message
      );
    }
    return this.getVoFromResponse<RecordResponse>(response, 'RecordVO');
  }
}
