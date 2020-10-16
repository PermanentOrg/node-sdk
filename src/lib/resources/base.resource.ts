import { ApiService } from '../api/api.service';

export class BaseResource {
  constructor(public api: ApiService) {}
}
