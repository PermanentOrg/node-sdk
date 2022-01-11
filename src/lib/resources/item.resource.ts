import { FolderVO, ItemVO, RecordVO } from '../model';

import { FolderResource } from './folder.resource';
import { RecordResource } from './record.resource';

export class ItemResource {
  constructor(
    protected folder: FolderResource,
    protected record: RecordResource
  ) {}

  public async copy(item: ItemVO, destination: FolderVO): Promise<ItemVO> {
    if (this.isItemARecord(item)) {
      return await this.record.copy([item as RecordVO], destination);
    } else {
      return await this.folder.copy([item as FolderVO], destination);
    }
  }

  public isItemARecord(item: ItemVO): boolean {
    const record = item as RecordVO;
    return typeof record.uploadFileName !== 'undefined';
    // HACK: uploadFileName is the only required property
    // we can use to distinguish between FolderVOs and RecordVOs.
  }
}
