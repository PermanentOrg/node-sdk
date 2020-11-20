import { PermSdkError } from '../../error';
import { ArchiveVO, FolderVO } from '../../model';

/**
 * Used to store data about the current session, such as:
 * - the current `archive`
 * - the root `folder` of the current `archive`
 * 
 * Certain API calls require base details to be successful. `ArchiveStore` can be used by a `Resource` to store and access this data, which simplifies the experience by keeping the end user from needing to manage and provide it on their own.
 */
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

  getPrivateRoot() {
    if (!this.root || !this.root.ChildItemVOs) {
      throw new PermSdkError('call init() before use');
    }

    const [privateRoot] = this.root.ChildItemVOs.filter(
      (f) => f.type === 'type.folder.root.private'
    );

    return privateRoot;
  }
}
