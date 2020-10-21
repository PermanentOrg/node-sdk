import { ApiService } from '../api/api.service';

import { ArchiveStore } from './archive';

export class BaseResource {
  constructor(public api: ApiService, public archiveStore?: ArchiveStore) {}
}
