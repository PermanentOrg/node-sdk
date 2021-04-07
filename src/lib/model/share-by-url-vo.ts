import { AccessRole } from '../enum/access-role';

import { BaseVO } from './base-vo';

export interface ShareByUrlVO extends BaseVO {
  shareby_urlId: number;
  folder_linkId: number;
  shareUrl: string;

  autoApproveToggle: 0 | 1;
  previewToggle: 0 | 1;
  defaultAccessRole?: AccessRole;
}

export type ShareLink = ShareByUrlVO;
