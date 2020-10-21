import { ArchiveVO } from '../../model/archive-vo';

export class AccountStore {
  private account: unknown | undefined;
  private archive: ArchiveVO | undefined;
  private root: unknown | undefined;

  setAccount(account: unknown) {
    this.account = account;
  }

  getAccount() {
    return this.account;
  }

  setArchive(archive: ArchiveVO) {
    this.archive = archive;
  }

  getArchive() {
    return this.archive;
  }

  setRoot(root: unknown) {
    this.root = root;
  }

  getRoot() {
    return this.root;
  }
}
