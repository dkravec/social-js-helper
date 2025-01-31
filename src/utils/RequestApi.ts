import { ErrorRes } from '../responses/errors/ErrorRes';
class RequestApi {
    private devToken: string;
    private appToken: string;
    private userToken: string | undefined;
    private accessToken: string | undefined;
    private userID: string | undefined;

    constructor(devToken: string, appToken: string, userToken?: string, accessToken?: string, userID?: string) {
        this.devToken = devToken;
        this.appToken = appToken;
        this.userToken = userToken;
        this.accessToken = accessToken;
        this.userID = userID;
    }

    async fetchApi<T>(url: string, options?: RequestInit): Promise<T | ErrorRes> {

        if (options?.headers === undefined) {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
        }     
        
        // UGH
        
    
        const response = await fetch(url, options);
        const data = await response.json();
        return data as T | ErrorRes;
    }
}

export { RequestApi };