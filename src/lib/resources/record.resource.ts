import { RecordResponse } from '../api/record.repo';
import { PermSdkError } from '../error';
import { RecordVOFromUrl } from '../model';

import { BaseResource } from './base.resource';

export class RecordResource extends BaseResource {
  public async uploadFromUrl(fileData: Omit<RecordVOFromUrl, 'status'>) {
    const response = await this.api.record.post(
      fileData.displayName,
      fileData.uploadFileName,
      fileData.uploadUri,
      fileData.parentFolder_linkId
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
