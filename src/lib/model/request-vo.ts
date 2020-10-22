import { SimpleVO } from './simple-vo';

export interface PermanentApiData {
  FolderVO?: unknown;
  RecordVO?: unknown;
  ArchiveVO?: unknown;
  AccountVO?: unknown;
  SimpleVO?: SimpleVO;
}

export interface RequestVO {
  apiKey: string;
  csrf?: string;
  data: PermanentApiData[];
}
