import {
  FolderVO,
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

  public getPresignedUrl(
    uploadedType: string,
    record: RecordVO,
    padToken?: string
  ) {
    const requestData: PermanentApiRequestData = {
      RecordVO: {
        parentFolder_linkId: record.parentFolder_linkId,
        size: record.size,
      },
      SimpleVOs: [
        {
          key: 'filetype',
          value: uploadedType,
        },
        {
          key: 'padToken',
          value: padToken,
        },
      ],
    };
    return this.request<SimpleVOResponse>('/record/getpresignedurl', [
      requestData,
    ]);
  }

  public registerRecord(record: RecordVO, s3url: string, padToken?: string) {
    const requestData: PermanentApiRequestData = {
      RecordVO: record,
      SimpleVOs: [
        {
          key: 's3url',
          value: s3url,
        },

        {
          key: 'padToken',
          value: padToken,
        },
      ],
    };
    return this.request<RecordResponse>('/record/registerRecord', requestData);
  }

  public copy(records: RecordVO[], destination: FolderVO) {
    const requestData: PermanentApiRequestData[] = records.map((recordVO) => {
      return {
        RecordVO: recordVO,
        FolderDestVO: {
          folder_linkId: destination.folder_linkId,
        },
      };
    });

    return this.request<RecordResponse>('/record/copy', requestData);
  }
}
