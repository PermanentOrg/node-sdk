import { BaseVO } from './base-vo';

export interface RecordVO extends BaseVO {
  recordId?: number;
  archiveId?: number;
  archiveNbr?: string;
  displayName: string;
  description?: string;

  folder_linkId: number;
  size?: number;
  uploadFileName: string;
  parentFolderId: number;
  parentFolder_linkId: number;
}

export type Record = RecordVO;

export interface RecordVOFromUrl
  extends Pick<RecordVO, 'displayName' | 'uploadFileName' | 'description'> {
  parentFolder_linkId: number;
  uploadUri: string;
  status: 'status.record.only_meta';
}
