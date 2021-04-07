import {
  BillingTransferVO,
  PermanentApiRequestData,
  PermanentApiResponseData,
} from '../model';

import { BaseRepo } from './base.repo';

export type BillingResponse = PermanentApiResponseData<'LedgerNonfinancialVO'>;

export class BillingRepo extends BaseRepo {
  public addStorage(accountId: number, spaceAmount?: number) {
    const ledgerVO: BillingTransferVO = {
      toAccountId: accountId,
      spaceAmount: spaceAmount,
      transactionNbr: '',
      fileAmount: 0,
    };
    const requestData: PermanentApiRequestData = {
      BillingTransferVO: ledgerVO,
    };
    return this.request<BillingResponse>('/billing/addstorage', [requestData]);
  }
}
