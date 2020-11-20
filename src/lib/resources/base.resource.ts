import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermanentApiResponseDataBase } from '../model';

import { ArchiveStore } from './archive';

/**
 * Base `Resource` to be extended by other feature/functional `Resources`
 * 
 * A `Resource` is the main organizational unit exposed to the end user, containing all methods pertaining to a specific feature, such as folders or sharing.
 * 
 * It optionally has access to shared session state stored in `ArchiveStore`, to automatically manage any boilerplate details required for a given task.
 *
 */
export class BaseResource {
  constructor(public api: ApiService, public archiveStore?: ArchiveStore) {}

  getVoFromResponse<T = PermanentApiResponseDataBase>(
    response: PermanentApiResponse<T>,
    voName: keyof T
  ) {
    return response.Results[0].data[0][voName];
  }

  getMessageFromResponse(response: PermanentApiResponse) {
    return response.Results[0].message;
  }
}
