import { ApiService } from '../../api/api.service';
import { FolderVO } from '../../model';
import { ArchiveVO } from '../../model/archive-vo';

export class ArchiveStore {
  private archive: ArchiveVO | undefined;
  private root: FolderVO | undefined;

  private setupPromise: Promise<void>;

  constructor(private api: ApiService) {
    this.setupPromise = this.setup();
  }

  private async setup() {
    const isLoggedInResponse = await this.api.auth.isLoggedIn();

    if (
      !isLoggedInResponse.isSuccessful ||
      isLoggedInResponse.Results[0].data[0].SimpleVO?.value !== true
    ) {
      throw Error('@permanent/node-sdk - credentials invalid!');
    }
  }

  public waitForSetup() {
    return this.setupPromise;
  }

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
