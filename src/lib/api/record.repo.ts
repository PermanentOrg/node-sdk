import {
  PermanentApiRequestData,
  PermanentApiResponseData,
  RecordVO,
  RecordVOFromUrl,
} from '../model';

import { SimpleVOResponse } from './auth.repo';
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

  public getPresignedUrl(uploadedType: string, record: RecordVO) {
    const requestData: PermanentApiRequestData = {
      RecordVO: {
        parentFolder_linkId: record.parentFolder_linkId,
        size: record.size,
      },
      SimpleVO: {
        key: 'filetype',
        value: uploadedType,
      },
    };
    return this.request<SimpleVOResponse>('/record/getpresignedurl', [
      requestData,
    ]);
  }

  public registerRecord(record: RecordVO, s3url: string) {
    const requestData: PermanentApiRequestData = {
      RecordVO: record,
      SimpleVO: {
        key: 's3url',
        value: s3url,
      },
    };
    return this.request<RecordResponse>('/record/registerRecord', requestData);
  }
}
