const WebSocket = require('ws')
require('dotenv').config()
// helpful info about classes https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
const Interact = class {
    ws = null
    headerTokens = null
    environment = null
    
    constructor({beta, environment}) {
        console.log(beta)
        if (
            (environment == 'node') || 
            (environment == 'web')
        ) {
            this.environment = environment 
        } else {
            this.environment = 'node'
        }
    }

    setTokens({ devToken, appToken, accessToken, userToken, userID}) {
        this.headerTokens = {
            devtoken: devToken,
            apptoken: appToken,
            accesstoken: accessToken,
            usertoken: userToken,
            userid: userID
        }
    }

    checkTokens() {
        return this.headerTokens
    }
}

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

interacTest()

function interacTest() {
    const interact = new Interact(true) 
    interact.setTokens({
        devToken: process.env.DEVTOKEN,
        appToken: process.env.APPTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        userToken: process.env.USERTOKEN,
        userID: process.env.USERID
    })

    const tokens = interact.checkTokens()
    console.log(tokens)
}

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