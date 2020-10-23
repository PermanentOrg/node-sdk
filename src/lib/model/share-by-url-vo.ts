import { BaseVO } from './base-vo';

export interface ShareByUrlVO extends BaseVO {
  shareby_urlId: number;
  folder_linkId: number;
  urlToken: string;
  shareUrl: string;
  uses: number;
  maxUses: number;
  previewToggle: 0 | 1;
  expiresDT: string;
  byAccountId: number;
  byArchiveId: number;
}
