import { BaseVO } from './base-vo';

export interface RecordVO extends BaseVO {
  recordId: number;
  archiveId: number;
  archiveNbr: string;
  displayName: string;

  folder_linkId: number;

  uploadFileName: string;
  parentFolderId: number;
  parentFolder_linkId: number;
}

export interface RecordVOFromUrl
  extends Pick<
    RecordVO,
    'displayName' | 'parentFolder_linkId' | 'uploadFileName'
  > {
  uploadUri: string;
  status: 'status.record.only_meta';
}
