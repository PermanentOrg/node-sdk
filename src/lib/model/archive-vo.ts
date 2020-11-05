import { BaseVO } from './base-vo';

export interface ArchiveVO extends BaseVO {
  archiveNbr: string;
}

export type Archive = ArchiveVO;
