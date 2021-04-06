import { BaseVO } from './base-vo';

export interface AccountVO extends BaseVO {
  accountId: number;
  defaultArchiveId: number;
}
