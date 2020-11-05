import {
  PermanentApiRequestData,
  PermanentApiResponseData,
  RecordVOFromUrl,
} from '../model';

import { BaseRepo } from './base.repo';

export type RecordResponse = PermanentApiResponseData<'RecordVO'>;

export class RecordRepo extends BaseRepo {
  public post(
    displayName: string,
    uploadFileName: string,
    uploadUri: string,
    parentFolder_linkId: number
  ) {
    const record: RecordVOFromUrl = {
      displayName,
      uploadUri,
      parentFolder_linkId,
      status: 'status.record.only_meta',
      uploadFileName,
    };

    const requestData: PermanentApiRequestData = {
      RecordVO: record,
    };

    return this.request<RecordResponse>('/record/post', [requestData]);
  }
}
