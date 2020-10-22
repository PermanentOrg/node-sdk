import { ArchiveVO, FolderVO } from '../../model';

export class ArchiveStore {
  private archive: ArchiveVO | undefined;
  private root: FolderVO | undefined;

  setArchive(archive: ArchiveVO) {
    this.archive = archive;
  }

  getArchive() {
    return this.archive;
  }

  setRoot(root: FolderVO) {
    this.root = root;
  }

  getRoot() {
    return this.root;
  }
}
