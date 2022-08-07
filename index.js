const WebSocket = require('ws')
require('dotenv').config()
// helpful info about classes https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
const posibleAPIVersions = ["v1", "v2(fake)"];

const Interact = class {
    apiURL = 'https://interact-api.novapro.net/'
    possibleAPIVersions = []
    possibleRoutes = []
    
    constructor({beta, environment}) {
        console.log(beta)
        if (
            (environment == 'node') || 
            (environment == 'web')
        ) {
            this.environment = environment;
        } else {
            this.environment = 'node';
        };

        if (beta) {
            this.apiURL = "http://localhost:5002/";
        };
    };

    async setApiVersion({version}) {
        if (!this.possibleAPIVersions[0]) await this.findPossibleRoutes()

        if (this.possibleAPIVersions.find(ver=> ver===version)) {
            this.apiVersion = version;
            return {"error" : false, "message" : this.apiVersion };
        } else {
            return { "error" : true, "message" : `The api version number provided is not allowed. Please pick from list: ${posibleAPIVersions}` };
        };
    };
    
    setBeta({beta}) {
        if (beta===null) {
            return { "error" : true, "message" : "Please write if you would like to request. Interact.setBeta() error." };
        } else if (beta==true) {
            this.apiURL = "http://localhost:5002/"
            return { "error" : false, "message" : `Beta mode is activated. Now using ${this.apiURL} as API url.` };
        } else if (beta===false) {
            this.apiURL = "https://interact-api.novapro.net/";
            return { "error" : false, "message" : `Beta mode is deactivated. Now using ${this.apiURL} as API url.` };
        } else {
            return { "error" : true, "message" : "Please select an if you would like a beta. true or false. Interact.setBeta() error." };
        };
    };

    setTokens({ devToken, appToken, accessToken, userToken, userID}) {
        this.headerTokens = {
            devtoken: devToken,
            apptoken: appToken,
            accesstoken: accessToken,
            usertoken: userToken,
            userid: userID
        };

        return this.headerTokens;
    };

    checkTokens() {
        return this.headerTokens;
    };

    async findPossibleRoutes() {
        if (this.possibleRoutes[0]) this.possibleRoutes=[];
        if (this.possibleAPIVersions[0]) this.possibleAPIVersions=[];

        const resPoss = await fetch(`${this.apiURL}API/possibleRoutes/`, { method: 'GET', headers: this.headerTokens });
        if (resPoss.error) possibleRoutes = false;
        const dataPoss = await resPoss.json();

        for (const route of dataPoss) {
            const newRoute = route.replace("/../../", "");
            if (newRoute.startsWith("/")) {
                this.possibleAPIVersions.push(newRoute.replace("/", ""));
            } else {
                this.possibleRoutes.push(newRoute);
            };
        };
        return { "possibleRoutes" : this.possibleRoutes, "possibleVersions" : this.possibleAPIVersions };
    };

    async api({ route, version }) {
        if (!this.possibleRoutes[0] || !this.possibleAPIVersions[0]) await this.findPossibleRoutes();

        var useVersion = this.apiVersion;
        if (version != undefined) useVersion = version;

        var possibleRoute = false;
        for (const routePossible of this.possibleRoutes) {
            if (routePossible==`${useVersion}/${route}`) possibleRoute = true;
        };

        if (!possibleRoute) return { "error" : true, "message" : `The route ${useVersion}/${route}, was not found to be in the possible list. Please check the version number, and the spelling. You can check the Interact API Documentation for more information. Interact.api() Error.` }

        const res = await fetch(`${this.apiURL}${useVersion}/${route}/`, { method: 'GET', headers: this.headerTokens });
        if (res.error) return { "error" : true, "response ": res }
        const data = await res.json();

        return { "error" : false, "response" : res, "data" : data };
    };
};

/*
const Client = class {
    constructor(beta) {
        console.log(beta)
        this.beta = beta   
    }

    login(token, callback) {
        var ws

        switch (this.beta) {
            case true:
                ws = new WebSocket('ws://localhost:5002');
                break;
        
            default:
                ws = new WebSocket('wss://interact.novapro.net/');
                break;
        }
        ws.onopen = function(event) {
            ws.send(JSON.stringify({"ready" : "true"}))
        };

        this.ws = ws
    }
    thisTest() {
        console.log(this)
    }
    ready() {
        this.ws.on('open', function open() {
            return "Websocket is now running"
        });

    }

    on(event) {
        var currentLooking
        var currentEvent
        
        this.ws.on('message', function (dataString) {
            const data = JSON.parse(dataString)
            console.log(data)
            currentEvent = data.type
        });

        switch (event) {
            case 'pings': // type 01
                currentLooking = 1
                break;
            case 'message': // type 02
                currentLooking = 2
                break;
            case 'deleteMessages': // type 03
                currentLooking = 3
                break;
            case 'reactions': // type 04
                currentLooking = 4
                break
            case 'editMessages': // type 05
                currentLooking = 5
                break
            case 'userJoin': // type 06
                currentLooking = 6
                break;
            case 'userLeave': // type 07
                currentLooking = 7
                break;
            default:
                break;
        }
        console.log(currentLooking + " " + currentEvent)

    }
    send(data) {
        console.log(this.ws.send())
        this.ws.send(JSON.stringify(data))
    }
}
*/
interacTest();

async function interacTest() {
    const interact = new Interact({ beta: true });
    console.log("-- new interact test");
    console.log(interact);

    const tokenSet = interact.setTokens({
        devToken: process.env.DEVTOKEN,
        appToken: process.env.APPTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        userToken: process.env.USERTOKEN,
        userID: process.env.USERID
    });
    console.log('-- setTokens test');
    console.log(tokenSet);

    const tokens = interact.checkTokens();
    console.log('-- checkTokens test');
    console.log(tokens);

    const betaEnv = interact.setBeta({ beta: false });
    console.log('-- setBeta test');
    console.log(betaEnv);

    const betaEnv2 = interact.setBeta({ beta: true });
    console.log('-- setBeta test');
    console.log(betaEnv2);

    const setVersion = await interact.setApiVersion({ version: "v1" });
    console.log('-- setApiVersion test');
    console.log(setVersion);

    const test = await interact.api({ route: "get/allPosts", version: "v2" });
    console.log('route test');
    console.log(test);

    const foundPossible = await interact.findPossibleRoutes() 
    console.log("find possible")
    console.log(foundPossible)
    
    console.log(interact)
};

/*
function testmain() {    
    const client = new Client(true)
    client.login(true)
    console.log(client.ready())
    // client.thisTest()

    const messageSend = {
        type: 2,
        apiVersion: "1.0",
        message: {
            content: `This is a test.`	
        }
    }
    client.send(messageSend)
}
*/

// client.send(messageSend)

// console.log(client)

// client.on("userLeave")
// client.on("message")

/*
const ws = new WebSocket('ws://localhost:5002');

ws.onopen = function(event) {
    ws.send(JSON.stringify(messageSend))
};
*/

// ws.send("hello")

// test()
function test() {
    const ws = new WebSocket('ws://localhost:5002');

    ws.onopen = function(event) {
        console.log("WebSocket is open now.");
    };
    const messageSend = {
        type: 02,
        apiVersion: "1.0",
        message: {
            content: `Hello there, its nice to see you. I am 3rf3, the best bot for interact live chat!`	
        }
    }

    ws.send("hello")
   // ws.send(JSON.stringify({"message" : "test"}))
}