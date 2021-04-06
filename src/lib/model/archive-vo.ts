import { BaseVO } from './base-vo';

export interface ArchiveVO extends BaseVO {
  archiveNbr: string;
  archiveId?: number;
}

export type Archive = ArchiveVO;
