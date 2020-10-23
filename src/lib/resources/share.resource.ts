import { PermSdkError } from '../error';
import { RecordVO } from '../model';

import { BaseResource } from './base.resource';

export class ShareResource extends BaseResource {
  public async createRecordShareLink(record: Pick<RecordVO, 'folder_linkId'>) {
    const response = await this.api.share.generateRecordShareLink(record);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    return this.getVoFromResponse(response, 'ShareByUrlVO').shareUrl;
  }
}
