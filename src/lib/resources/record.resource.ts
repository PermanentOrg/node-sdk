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

    const record = response.Results[0].data[0].RecordVO;

    if (record !== undefined) {
      return record;
    } else {
      throw new PermSdkError(
        'record could not be created',
        response.Results[0].message
      );
    }
  }
}
