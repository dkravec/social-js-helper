import { RequestApi } from '../utils/RequestApi';
class BaseApi {
    protected request: RequestApi;

    constructor(request: RequestApi) {
        this.request = request;
    }

    updateRequest(request: RequestApi) {
        this.request = request;
    }
}

export { BaseApi };