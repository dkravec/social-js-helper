const WebSocket = require('ws')
const { EventEmitter } = require('events');

// helpful info about classes https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
const posibleAPIVersions = ["v1", "v2(fake)"];

class Interact {
    apiURL = 'https://interact-api.novapro.net/';
    possibleAPIVersions = [];
    possibleRoutes = [];
    postCache = {};
    userCache = {};
    // headerTokens = {};
    defaultVersion = "v1";
    
    constructor({beta, environment}) {
        // console.log(beta)
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
            return { "error" : true, "message" : `The api version number provided is not allowed. Please pick from list: ${posibleAPIVersions}`, "errorFunction" : "Interact.setApiVersion()" };
        };
    };
    
    setBeta({beta}) {
        if (beta===null) {
            return { "error" : true, "message" : "Please write if you would like to request.", "errorFunction" : "Interact.setBeta()" };
        } else if (beta==true) {
            this.apiURL = "http://localhost:5002/"
            return { "error" : false, "message" : `Beta mode is activated. Now using ${this.apiURL} as API url.` };
        } else if (beta===false) {
            this.apiURL = "https://interact-api.novapro.net/";
            return { "error" : false, "message" : `Beta mode is deactivated. Now using ${this.apiURL} as API url.` };
        } else {
            return { "error" : true, "message" : "Please select an if you would like a beta. true or false.", "errorFunction" : "Interact.setBeta()" };
        };
    };

    async userLogin({ username, password }) {
        if (!username && !password) return {"error" : true, "message" : "There was no input from the user. Please provide a username and password.", "errorFunction" : "Interact.userLogin()" };
        else if (!username) return {"error" : true, "message" : "There was no username input from the user. Please provide a username.", "errorFunction": "Interact.userLogin()"};
        else if (!password) return {"error" : true, "message" : "There was no password input from the user. Please provide a password.", "errorFunction": "Interact.userLogin()"};

        if (!this.headerTokens.apptoken) return {"error" : true, "message" : "There is no appToken set. Please set an appToken.", "errorFunction" : "Interact.userLogin()"};
        if (!this.headerTokens.devtoken) return {"error" : true, "message" : "There is no devToken set. Please set an devToken.", "errorFunction" : "Interact.userLogin()"};

    
        let headers = {};
        headers.devToken = this.headerTokens.devtoken;
        headers.appToken = this.headerTokens.apptoken;
        headers.username = username;
        headers.password = password;

        // console.log(headers)
        // console.log(`${this.apiURL}${this.defaultVersion}/auth/userLogin/`)

        const res = await fetch(`${this.apiURL}${this.defaultVersion}/auth/userLogin/`, { method: 'GET', headers });
        if (res.error) return { "error" : true, "response" : res, "errorFunction" : "Interact.userLogin()" };
        const data = await res.json();
        if (!res.ok) return { "error" : true, "response" : res, "data" : data, "errorFunction" : "Interact.userLogin()" };

        this.headerTokens.accesstoken = data.accessToken;
        this.headerTokens.usertoken = data.userToken;
        this.headerTokens.userid = data.userID;
        const newUser = new UserCache({ "data" : data.publicData});
        this.userCache[newUser.userID] = newUser

        return { "error" : false, "response" : res, "data" : data, "headerTokens" : this.headerTokens };
    }

    setTokens({ devToken, appToken, accessToken, userToken, userID}) {
        if (!this.headerTokens) this.headerTokens = {}

        if (devToken) this.headerTokens.devtoken = devToken;
        if (appToken) this.headerTokens.apptoken = appToken;
        if (accessToken) this.headerTokens.accesstoken = accessToken;
        if (userToken) this.headerTokens.usertoken = userToken;
        if (userID) this.headerTokens.userid = userID;

        return this.headerTokens;
    };

    startws() {
        if (!this.headerTokens) throw new Error(`There is no tokens set.`);
        const apiURL = this.apiURL;
        const headerTokens = this.headerTokens;

        this.ws = new Connection({ InteractClass: this, apiURL, headerTokens })
    }
    saveCache(title, data) {
        this.postCache[title ? title : "test"] = data;

        return {"postCache" : this.postCache, "userCache" : this.userCache};
    }

    // async on(name, listener) {
    //     if (!this.ws) throw new Error(`There is no connection to websocket.`);

    //     if (!this._events[name]) {
    //         this._events[name] = [];
    //     };

    //     this._events[name].push(listener);
    // };
    
    checkTokens() {
        return this.headerTokens;
    };

    async findPossibleRoutes() {
        if (this.possibleRoutes[0]) this.possibleRoutes=[];
        if (this.possibleAPIVersions[0]) this.possibleAPIVersions=[];

        const resPoss = await fetch(`${this.apiURL}API/possibleRoutes/`, { method: 'GET', headers: this.headerTokens });
        if (resPoss.error) possibleRoutes = false;
        const dataPoss = await resPoss.json();

        if (dataPoss.error || !resPoss.ok) return { "error" : true, "response": resPoss, "data" : dataPoss, "errorFunction" : "Interact.findPossibleRoutes()" };
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

    async api({ route, version, param, body }) {
        if (!this.possibleRoutes[0] || !this.possibleAPIVersions[0]) await this.findPossibleRoutes();

        var useVersion = this.apiVersion;
        if (version != undefined) useVersion = version;

        let possibleRoute = false;
        for (const routePossible of this.possibleRoutes) {
            if (routePossible==`${useVersion}/${route}`) possibleRoute = true;
        };

        if (!possibleRoute) return { "error" : true, "message" : `The route ${useVersion}/${route}, was not found to be in the possible list. Please check the version number, and the spelling. You can check the Interact API Documentation for more information.`, "errorFunction" : "Interact.api()" };

        const res = await fetch(`${this.apiURL}${useVersion}/${route}/`, { method: 'GET', headers: this.headerTokens });
        
        if (res.error) return { "error" : true, "response" : res, "errorFunction" : "Interact.api()" };
        const data = await res.json();

        return { "error" : false, "response" : res, "data" : data };
    };

    async get({ route, version, param, body }) {
        // incomplete
        if (!this.possibleRoutes[0] || !this.possibleAPIVersions[0]) await this.findPossibleRoutes();

        var useVersion = this.apiVersion;
        if (version != undefined) useVersion = version;

        var possibleRoute = false;
        for (const routePossible of this.possibleRoutes) {
            if (routePossible==`${useVersion}/${route}`) possibleRoute = true;
        };

        if (!possibleRoute) return { "error" : true, "message" : `The route ${useVersion}/${route}, was not found to be in the possible list. Please check the version number, and the spelling. You can check the Interact API Documentation for more information.`, "errorFunction" : "Interact.get()" };

        const res = await fetch(`${this.apiURL}${useVersion}/${route}${param? `/${param}` : "/"}`, { method: 'GET', headers: this.headerTokens });
        if (res.error) return { "error" : true, "response": res, "errorFunction" : "Interact.get()" };
        const data = await res.json();

        if (route == "post") {

        };
    };
};

class PostCache {

};

class UserCache {
    userID
    __v
    username
    displayName
    pronouns
    statusTitle
    lastEditDisplayname
    creationTimestamp
    followerCount
    FollowingCount
    likeCount
    likedCount
    totalPosts
    totalReplies
    privacySetting
    lastEdit

    constructor({data}) {
        this.userID = data._id;
        this.__v = data.__v;
        this.username = data.username;
        this.displayName = data.displayName;
        this.pronouns = data.pronouns;
        this.statusTitle = data.statusTitle;
        this.lastEditDisplayname = data.lastEditDisplayname;
        this.creationTimestamp = data.creationTimestamp;
        this.followerCount = data.followerCount;
        this.FollowingCount = data.FollowingCount;
        this.likeCount = data.likeCount;
        this.likedCount = data.likedCount;
        this.totalPosts = data.totalPosts;
        this.totalReplies = data.totalReplies;
        this.privacySetting = data.privacySetting;
        this.lastEdit = data.lastEdit;
    };

    updateValues({data}) {
        for (const key in data) {
            this[key] = data[key];
        };
    };
};

class Connection extends EventEmitter {
    // test = true
    _events = {};

    constructor ({ InteractClass, apiURL, headerTokens }) {
        super();
        if (InteractClass) this.InteractClass = InteractClass;

        this.apiURL = apiURL;
        this.headerTokens = headerTokens;
        this.ws = new WebSocket(`${apiURL.replace("http", "ws")}?userID=${headerTokens.userid}`);
        // this.ws = 
        // if () 
        // switch (this.beta) {
        //     case true:
        //         this.ws = new WebSocket('ws://localhost:5002');
        //         break;
        
        //     default:
        //         this.ws = new WebSocket('wss://interact.novapro.net/');
        //         break;
        // };

        const types = {
            "message" : 2,
            "messageDelete" : 3,
            "messageEdit" : 5,
            "userJoin" : 6,
            "userLeave" : 7,
            "userTyping" : 8,
            "userStopTyping" : 9,
            "auth" : 10,
            "ready" : 11, // unoffical
            "errorMessage" : 101,
            "connect" : 200,
            "getGroups" : 201,
            "createGroup" : 202,
            "getGroup" : 203,
            "deleteGroup" : 204,
            "addUserToGroup" : 205,
            "removeUserFromGroup" : 206,
            "changeGroupName" : 207,
            "sendMessage" : 210,
            "getGroupMessages" : 211
        }

        const authTypes = {
            "pleaseConnect" : 1,
            "failedAuth" : 3,
            "successAuth" : 4,
        };
        this.types = types;
        this.authTypes = authTypes;

        this.ws.on('message', (data) => {
            const message = JSON.parse(data);

            if (message.type == types.auth) {
                if (message.mesType == 1) {
                    const authSend = {
                        type: 10,
                        apiVersion: "1.0",
                        userID: this.headerTokens.userid,
                        mesType: 2,
                        tokens: this.InteractClass.headerTokens
                    };
                    this.ws.send(JSON.stringify(authSend));
                } else if (message.mesType == 4) {
                    this.emitMessage({eventType: "11", data: message});
                };
            };
            
            this.emitMessage({eventType: message.type, data: message});
            // for (const listener in this._events) {
            //     if (types[listener] == message.type) {
            //         const fireCallbacks = (callback) => callback(message);
            //         this._events[listener].forEach(fireCallbacks);
            //     };
            // };
        });
    };

    emitMessage({ eventType, data }) {
        for (const listener in this._events) {
            if (this.types[listener] == eventType) {
                const fireCallbacks = (callback) => callback(data);
                this._events[listener].forEach(fireCallbacks);
            };
        };
    };

    on(typeName, listenerFunction, data) {
        if (!this.ws) throw new Error(`There is no connection to websocket.`);
        if (!this._events[typeName]) this._events[typeName] = [];

        this._events[typeName].push(listenerFunction);
    };
    send(data) {
        const {groupID, content, replyID} = data;
    
        if (!groupID) {
            var messageSend = {
                type: 2,
                apiVersion: "1.0",
            //    roomID,
                message: {
                    userID: this.InteractClass.headerTokens.userid,
                    content,
                }
            };
            if (replyID) messageSend.message.replyID = replyID;
            this.ws.send(JSON.stringify(messageSend));
            console.log('done')
        };
    };
};

class InteractGroups {

    constructor({ wsClass, groupID }) {
        this.wsClass = wsClass;
        this.groupID = groupID;

    };
    
    updateGroupValues({data}) {
    
    };
}

module.exports = Interact;