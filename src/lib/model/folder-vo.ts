import { BaseVO } from './base-vo';

type FolderType =
  | 'type.folder.root.app'
  | 'type.folder.root.private'
  | 'type.folder.root.public'
  | 'type.folder.root.share'
  | 'type.folder.root.vault'
  | 'type.folder.app'
  | 'type.folder.private'
  | 'type.folder.public'
  | 'type.folder.share'
  | 'type.folder.vault'
  | 'page';

export interface FolderVO extends BaseVO {
  folder_linkId: number;
  folderId: number;
  type?: FolderType;

  archiveNbr?: string;
  archiveId?: number;

  displayName?: string;

  parentFolderId?: number;
  parentFolder_linkId?: number;

  ChildFolderVOs?: FolderVO[];
  ChildItemVOs?: FolderVO[];
}

export type ParentFolderVO = Pick<FolderVO, 'folder_linkId'>;

export type Folder = FolderVO;
