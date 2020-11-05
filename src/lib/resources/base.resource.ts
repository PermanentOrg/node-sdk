import { ApiService } from '../api/api.service';
import { PermanentApiResponse } from '../api/base.repo';
import { PermanentApiResponseDataBase } from '../model';

export class BaseResource {
  constructor(public api: ApiService) {}

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
