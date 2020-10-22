import { BaseVO } from './base-vo';

export interface RecordVO extends BaseVO {
  recordId: number;
  archiveId: number;
  archiveNbr: string;
  displayName: string;

  uploadFileName?: string;
  parentFolderId?: number;
  parentFolder_linkId?: number;
}

export interface RecordVOFromUrl
  extends Pick<
    RecordVO,
    'displayName' | 'parentFolder_linkId' | 'type' | 'uploadFileName'
  > {
  uploadUri: string;
  status: 'status.record.only_meta';
}
