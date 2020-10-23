import { BaseVO } from './base-vo';

export interface ShareByUrlVO extends BaseVO {
  shareby_urlId: number;
  folder_linkId: number;
  shareUrl: string;
}

export type ShareLink = ShareByUrlVO;
