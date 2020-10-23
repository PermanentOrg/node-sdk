import { RecordVO } from './record-vo';

import { AccountVO, ArchiveVO, FolderVO, ShareByUrlVO, SimpleVO } from '.';

export interface PermanentApiResponseDataBase {
  FolderVO?: FolderVO;
  RecordVO?: RecordVO;
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  SimpleVO?: SimpleVO;
  Shareby_urlVO?: ShareByUrlVO;
}

export type PermanentApiResponseData<
  T extends keyof PermanentApiResponseDataBase
> = Required<Pick<PermanentApiResponseDataBase, T>>;

export interface PermanentApiRequestData {
  FolderVO?: Partial<FolderVO>;
  RecordVO?: Partial<RecordVO>;
  ArchiveVO?: Partial<ArchiveVO>;
  AccountVO?: Partial<AccountVO>;
  SimpleVO?: Partial<SimpleVO>;
  Shareby_urlVO?: Partial<ShareByUrlVO>;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiRequestData[];
}
