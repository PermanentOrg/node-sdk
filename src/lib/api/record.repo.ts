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
    parentFolder_linkId: number,
    description?: string
  ) {
    const record: RecordVOFromUrl = {
      displayName,
      uploadUri,
      parentFolder_linkId,
      status: 'status.record.only_meta',
      uploadFileName,
    };

    if (description) {
      record.description = description;
    }

    const requestData: PermanentApiRequestData = {
      RecordVO: record,
    };

    return this.request<RecordResponse>('/record/post', [requestData]);
  }

  public getById(recordId: number) {
    const requestData: PermanentApiRequestData = {
      RecordVO: {
        recordId: recordId,
      },
    };
    return this.request<RecordResponse>('/record/getbyid', [requestData]);
  }
}
