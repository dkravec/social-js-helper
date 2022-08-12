const Interact = require('./index');
require('dotenv').config()

interactTest();

async function interactTest() {
    const interact = new Interact({ beta: true });
    console.log("-- new interact test");
    console.log(interact);
    // interact.on('event', () => { console.log('triggered!') } );
    // interact.eventTest()
    
    const tokenSet = interact.setTokens({
        devToken: process.env.DEVTOKEN,
        appToken: process.env.APPTOKEN,
        // accessToken: process.env.ACCESSTOKEN,
        // userToken: process.env.USERTOKEN,
        // userID: process.env.USERID
    });
    
    console.log('-- setTokens test');
    console.log(tokenSet);
    
    const userLogin = await interact.userLogin({
        username: process.env.CLIENT_USERNAME,
        password: process.env.CLIENT_PASSWORD
    });
    console.log("-- userLogin");
    console.log(userLogin);
    
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
    
    interact.startws();

    interact.saveCache("test12", { "content" : "this is a test" });
    const saveCache = interact.saveCache("test1234", { "content" : "this is a test" });
    console.log("-- saveCache test");
    console.log(saveCache);
   
    // await interact.ws.on('testEvent', handleMyEvent);
    interact.ws.on('ready', (data) =>{
        console.log('im ready')
        interact.ws.send({content: "this is a test"})
    });
    
    interact.ws.on('userJoin', handleMyEvent);
    interact.ws.on('auth', handleMyEvent2);
    interact.ws.on('message', handleMyEvent3);
};

const handleMyEvent = (data) => console.log('Was fired: ', data);
const handleMyEvent2 = (data) => console.log('Was fired2: ', data);
const handleMyEvent3 = (data) => console.log('There was a new message: ', data.message.content);