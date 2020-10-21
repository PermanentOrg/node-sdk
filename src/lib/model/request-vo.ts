import { AccountVO, ArchiveVO, FolderVO, SimpleVO } from '.';

export interface PermanentApiData {
  FolderVO?: FolderVO;
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
