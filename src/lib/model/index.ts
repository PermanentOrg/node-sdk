import { FolderVO } from './folder-vo';
import { RecordVO } from './record-vo';

export * from './account-vo';
export * from './archive-vo';
export * from './folder-vo';
export * from './record-vo';
export * from './request-vo';
export * from './share-by-url-vo';
export * from './simple-vo';

export type ItemVO = FolderVO | RecordVO;
