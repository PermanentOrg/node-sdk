import { BaseVO } from './base-vo';

export interface LedgerNonfinancialVO extends BaseVO {
  toAccountId?: number;
  spaceAmount?: number;
  transactionNbr?: string; // default null
  fileAmount?: number; // default zero
}

export type LedgerNonfinancial = LedgerNonfinancialVO;
