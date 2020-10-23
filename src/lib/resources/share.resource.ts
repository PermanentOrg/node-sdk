import { PermSdkError } from '../error';
import { RecordVO } from '../model';

import { BaseResource } from './base.resource';

export class ShareResource extends BaseResource {
  /**
   * Creates a shareable URL for an existing record in the current archive
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   *
   * const record // existing RecordVO
   * const url = await perm.share.createRecordShareLink(record)
   * ```
   *
   * @returns a Promise that resolves to the shareable URL as a string
   */
  public async createRecordShareLink(record: Pick<RecordVO, 'folder_linkId'>) {
    const response = await this.api.share.generateRecordShareLink(record);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    return this.getVoFromResponse(response, 'Shareby_urlVO').shareUrl;
  }
}