import { User } from "../../interfaces/User";

interface UserLoginResponse {
    login: boolean;
    publicData: User;
    accessToken: string;
    userToken: string;
    userID: string;
}

export type { UserLoginResponse };