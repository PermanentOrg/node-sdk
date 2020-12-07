import { AccessRole } from '../enum/access-role';
import { PermSdkError } from '../error';
import { FolderVO, RecordVO, ShareByUrlVO } from '../model';

import { BaseResource } from './base.resource';

export class ShareResource extends BaseResource {
  async updateShareLink(
    shareByUrlVo: ShareByUrlVO,
    showPreview: boolean,
    autoApprove: boolean,
    defaultAccessRole?: AccessRole
  ) {
    const showPreviewChanged = showPreview
      ? shareByUrlVo.previewToggle === 0
      : shareByUrlVo.previewToggle === 1;
    const autoApproveChanged = autoApprove
      ? shareByUrlVo.autoApproveToggle === 0
      : shareByUrlVo.autoApproveToggle === 1;
    const defaultAccessChanged =
      defaultAccessRole && defaultAccessRole !== shareByUrlVo.defaultAccessRole;

    if (showPreviewChanged || autoApproveChanged || defaultAccessChanged) {
      shareByUrlVo.autoApproveToggle = autoApprove ? 1 : 0;
      shareByUrlVo.previewToggle = showPreview ? 1 : 0;
      shareByUrlVo.defaultAccessRole = defaultAccessRole;

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
    autoApprove = true,
    defaultAccessRole = AccessRole.Viewer
  ) {
    const response = await this.api.share.generateRecordShareLink(record);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Record share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    const vo = this.getVoFromResponse(response, 'Shareby_urlVO');

    await this.updateShareLink(vo, showPreview, autoApprove, defaultAccessRole);

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
    autoApprove = true,
    defaultAccessRole = AccessRole.Viewer
  ) {
    const response = await this.api.share.generateFolderShareLink(folder);
    if (!response.isSuccessful) {
      throw new PermSdkError(
        'Folder share link creation failed',
        this.getMessageFromResponse(response)
      );
    }

    const vo = this.getVoFromResponse(response, 'Shareby_urlVO');

    await this.updateShareLink(vo, showPreview, autoApprove, defaultAccessRole);

    return vo.shareUrl;
  }
}
