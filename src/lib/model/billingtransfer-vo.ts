import { BaseVO } from './base-vo';

export interface BillingTransferVO extends BaseVO {
  toAccountId: number;
  spaceAmount?: number;
  transactionNbr?: string; // default null
  fileAmount?: number; // default zero
}

export type BillingTransfer = BillingTransferVO;
