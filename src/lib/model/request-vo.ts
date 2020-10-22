import { RecordVO } from './record-vo';

import { AccountVO, ArchiveVO, FolderVO, SimpleVO } from '.';

export interface PermanentApiResponseData {
  FolderVO?: FolderVO;
  RecordVO?: unknown;
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  SimpleVO?: SimpleVO;
}

export interface PermanentApiRequestData {
  FolderVO?: Partial<FolderVO>;
  RecordVO?: Partial<RecordVO>;
  ArchiveVO?: Partial<ArchiveVO>;
  AccountVO?: Partial<AccountVO>;
  SimpleVO?: Partial<SimpleVO>;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiRequestData[];
}
