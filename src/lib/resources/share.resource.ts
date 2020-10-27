import { PermSdkError } from '../error';
import { FolderVO, RecordVO, ShareByUrlVO } from '../model';

import { BaseResource } from './base.resource';

export class ShareResource extends BaseResource {
  async updateShareLink(
    shareByUrlVo: ShareByUrlVO,
    showPreview: boolean,
    autoApprove: boolean
  ) {
    const showPreviewChanged = showPreview
      ? shareByUrlVo.previewToggle === 0
      : shareByUrlVo.previewToggle === 1;
    const autoApproveChanged = autoApprove
      ? shareByUrlVo.autoApproveToggle === 0
      : shareByUrlVo.autoApproveToggle === 1;
    if (showPreviewChanged || autoApproveChanged) {
      shareByUrlVo.autoApproveToggle = autoApprove ? 1 : 0;
      shareByUrlVo.previewToggle = showPreview ? 1 : 0;

      await this.api.share.updateShareLink(shareByUrlVo);
    }
  }

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
   * @returns a Promise that resolves to the shareable URL as a string
   */
  public async createRecordShareLink(
    record: Pick<RecordVO, 'folder_linkId'>,
    showPreview = true,
    autoApprove = true
  ) {
    const response = await this.api.share.generateRecordShareLink(record);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Record share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    const vo = this.getVoFromResponse(response, 'Shareby_urlVO');

    await this.updateShareLink(vo, showPreview, autoApprove);

    return vo.shareUrl;
  }

  /**
   * Creates a shareable URL for an existing folder in the current archive
   *
   * #### Example
   * ```js
   * const perm = new Permanent(config);
   *
   * const folder // existing FolderVO
   * const url = await perm.share.createFolderShareLink(folder)
   * ```
   *
   * @returns a Promise that resolves to the shareable URL as a string
   */
  public async createFolderShareLink(
    folder: Pick<FolderVO, 'folder_linkId'>,
    showPreview = true,
    autoApprove = true
  ) {
    const response = await this.api.share.generateFolderShareLink(folder);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Folder share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    const vo = this.getVoFromResponse(response, 'Shareby_urlVO');

    await this.updateShareLink(vo, showPreview, autoApprove);

    return vo.shareUrl;
  }
}
