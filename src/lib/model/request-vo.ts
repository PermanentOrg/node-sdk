import { AccountVO } from './account-vo';
import { ArchiveVO } from './archive-vo';
import { DestinationFolderVO, FolderVO } from './folder-vo';
import { RecordVO } from './record-vo';
import { ShareByUrlVO } from './share-by-url-vo';
import { SimpleVO } from './simple-vo';

export interface PermanentApiResponseDataBase {
  ArchiveVO?: ArchiveVO;
  AccountVO?: AccountVO;
  FolderVO?: FolderVO;
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
  FolderVO?: Partial<FolderVO>;
  FolderDestVO?: DestinationFolderVO;
  RecordVO?: Partial<RecordVO>;
  SimpleVO?: Partial<SimpleVO>;
  SimpleVOs?: Partial<SimpleVO>[];
  Shareby_urlVO?: Partial<ShareByUrlVO>;
}

export interface RequestVO {
  csrf?: string;
  data: PermanentApiRequestData[] | PermanentApiRequestData;
}
