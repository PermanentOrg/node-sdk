import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermanentApiResponseDataBase } from '../model';

import { ArchiveStore } from './archive';

export class BaseResource {
  constructor(public api: ApiService, public archiveStore?: ArchiveStore) {}

  getVoFromResponse<T = PermanentApiResponseDataBase>(
    response: PermanentApiResponse<T>,
    voName: keyof T
  ) {
    return response.Results[0].data[0][voName];
  }
}
