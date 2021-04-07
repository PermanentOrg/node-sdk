import { AccountVO } from './account-vo';
import { ArchiveVO } from './archive-vo';
import { BillingTransferVO } from './billingtransfer-vo';
import { FolderVO } from './folder-vo';
import { LedgerNonfinancialVO } from './ledgernonfinancial-vo';
import { RecordVO } from './record-vo';
import { ShareByUrlVO } from './share-by-url-vo';
import { SimpleVO } from './simple-vo';

export interface PermanentApiResponseDataBase {
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  BillingTransferVO?: BillingTransferVO;
  FolderVO?: FolderVO;
  LedgerNonfinancialVO?: LedgerNonfinancialVO;
  RecordVO?: RecordVO;
  SimpleVO?: SimpleVO;
  Shareby_urlVO?: ShareByUrlVO;
}

export type PermanentApiResponseData<
  T extends keyof PermanentApiResponseDataBase
> = Required<Pick<PermanentApiResponseDataBase, T>>;

export interface PermanentApiRequestData {
  ArchiveVO?: Partial<ArchiveVO>;
  AccountVO?: Partial<AccountVO>;
  BillingTransferVO?: Partial<BillingTransferVO>;
  FolderVO?: Partial<FolderVO>;
  LedgerNonfinancialVO?: Partial<LedgerNonfinancialVO>;
  RecordVO?: Partial<RecordVO>;
  SimpleVO?: Partial<SimpleVO>;
  Shareby_urlVO?: Partial<ShareByUrlVO>;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiRequestData[];
}
