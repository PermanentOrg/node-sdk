import { ApiService } from '../api/api.service';

import { AccountStore } from './account';

export class BaseResource {
  constructor(public api: ApiService, public accountStore?: AccountStore) {}
}
