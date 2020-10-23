import {
  FolderVO,
  PermanentApiRequestData,
  PermanentApiResponseData,
  RecordVO,
} from '../model';

import { BaseRepo } from './base.repo';

export type ShareByUrlResponse = PermanentApiResponseData<'Shareby_urlVO'>;

export class ShareRepo extends BaseRepo {
  public generateRecordShareLink(record: Pick<RecordVO, 'folder_linkId'>) {
    const requestData: PermanentApiRequestData = {
      RecordVO: record,
    };

    return this.request<ShareByUrlResponse>('/share/generateShareLink', [
      requestData,
    ]);
  }

  public generateFolderShareLink(folder: Pick<FolderVO, 'folder_linkId'>) {
    const requestData: PermanentApiRequestData = {
      FolderVO: folder,
    };

    return this.request<ShareByUrlResponse>('/share/generateShareLink', [
      requestData,
    ]);
  }
}
