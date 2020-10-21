import { BaseVO } from './base-vo';

type ArchiveType =
  | 'type.archive.person'
  | 'type.archive.family'
  | 'type.archive.organization'
  | 'type.archive.nonprofit';

export interface ArchiveVO extends BaseVO {
  accessRole: string;
  archiveId: number;
  archiveNbr: string;
  birthDay: string;
  ChildFolderVOs: unknown[];
  company: string;
  description: string;
  fileLeft: number;
  fileTotal: number;
  FolderSizeVOs: unknown[];
  fullName: string;
  homeCity: string;
  homeCountry: string;
  homeState: string;
  ItemVOs: unknown[];
  RecordVOs: unknown[];
  relationType: string;
  spaceLeft: number;
  spaceTotal: number;
  thumbArchiveNbr: string;
  thumbURL1000: string;
  thumbURL200: string;
  thumbURL2000: string;
  thumbURL500: string;
  type: ArchiveType;
}
