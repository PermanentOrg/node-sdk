import { RecordVO } from './record-vo';

import { AccountVO, ArchiveVO, FolderVO, ShareByUrlVO, SimpleVO } from '.';

export interface PermanentApiResponseData {
  FolderVO?: FolderVO;
  RecordVO?: RecordVO;
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  SimpleVO?: SimpleVO;
  ShareByUrlVO?: ShareByUrlVO;
}

export interface PermanentApiRequestData {
  FolderVO?: Partial<FolderVO>;
  RecordVO?: Partial<RecordVO>;
  ArchiveVO?: Partial<ArchiveVO>;
  AccountVO?: Partial<AccountVO>;
  SimpleVO?: Partial<SimpleVO>;
  ShareByUrlVO?: Partial<ShareByUrlVO>;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiRequestData[];
}
