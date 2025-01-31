class InteractClient {
    private devToken: string;
    private appToken: string;

    constructor(devToken:string, appToken:string) {
        this.devToken = devToken;
        this.appToken = appToken;
    }
}

export const interact = (taco = ''): string => `${taco} from my package`;