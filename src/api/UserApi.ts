import { User } from "../interfaces/User";
import { UserLoginResponse } from "../responses/user/UserLogin";
import { ErrorRes } from "../responses/errors/ErrorRes";
import { BaseApi } from "./BaseApi";

class InteractUserApi extends BaseApi {
    async loginUser(username: string, password: string): Promise<UserLoginResponse | ErrorRes> {
        // Implement the logic to login the user and return a User object
        const body = JSON.stringify({ username, password });
        // const userLogin = await this.request.fetchApi<UserLoginResponse>(`/user/login`, { method: 'POST', body });
        
        const headers = new Headers(); 
        headers.append('username', username);
        headers.append('password', password);

        const userLogin = await this.request.fetchApi<UserLoginResponse>(`/user/login`, { method: 'POST', headers });

        // const userLogin = await this.request.fetchApi<UserLoginResponse>(`/user/login`);

        // if ('error' in userLogin) {
        //     return userLogin as ErrorRes;
        // }

        // return (userLogin as UserLoginResponse).publicData;

        return userLogin;
    }
}