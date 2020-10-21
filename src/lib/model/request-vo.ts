import { AccountVO } from './account-vo';
import { ArchiveVO } from './archive-vo';
import { SimpleVO } from './simple-vo';

export interface PermanentApiData {
  FolderVO?: unknown;
  RecordVO?: unknown;
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  SimpleVO?: SimpleVO;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiData[];
}
