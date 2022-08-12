## Interact JS Helper
Created by Daniel Kravec, on September 5th, 2021

## new Interact({ beta });
| Param | Required | Default | Description | Options |
| - | - | - | - | - |
| beta | false | false | Do you want to run with localhost or production? | true / false |


usage:
```js
const interact = new Interact({ beta: true });

console.log(interact) 
/* returns
    Interact {
        apiURL: 'http://localhost:5002/',
        possibleAPIVersions: [],
        possibleRoutes: [],
        postCache: [],
        userCache: [],
    }
*/
```

## Interact.setTokens({ devToken, appToken, accessToken, userToken, userID });

| Param | Required | Default | Description | Options |
| - | - | - | - | - |
| devToken | true | null | Input your devoloper token in order to have access to Interact API |
| appToken | true | null | Input your devoloper token in order to have access to Interact API |
| accessToken | true | null | Input your devoloper token in order to have access to Interact API |
| userToken | true | null | Input your devoloper token in order to have access to Interact API |
| userID | true | null | This is the client's userID, to be used with the Interact API.|

```js
    const tokens = {
        devToken: process.env.DEVTOKEN,
        appToken: process.env.APPTOKEN,
        accessToken: process.env.ACCESSTOKEN,
        userToken: process.env.USERTOKEN,
        userID: process.env.USERID
    }
    const tokenSet = interact.setTokens(tokens);

    console.log('-- setTokens test');
    console.log(tokenSet);
```

## Interact.setApiVersion({ version });

| Param | Required | Default | Description | Options |
| - | - | - | - | - |
| beta | false | false | Do you want to run with localhost or production? | true / false |

usage:
```js
const version = interact.setApiVersion({ version: "v1" });

console.log(verison);
/* returns:
    {"error" : false, "message" : "v1" }
*/
```


## Version History
### 1.0 (1.2021.09.05)
- Created a Client Class.
    - Connects to websocket. 
    - You can send messages to web socket server.
    - Attempted to create Class.on, and Class.ready. (cant recall if it worked, probably not)

### 1.0 (2.2022.08.03)
- Created a new class.
    - You can set tokens, and environment type.

### 1.0 (3.2022.08.04)
- Commented out old Client class.
- Added apiURLs, so if it’s beta or not.
- Added setBeta to set the apiURL.
- Added setApiVersoin, and it checks if it’s proper or not.
- Returns tokens on setTokens.
- Added an api version, fetches a route once it’s ran.
- For the test.
    - Console logs each function for tests.

### 1.0 (4.2022.08.06)
- Created findPossibleRoutes function, which gets possible routes and versions from api.
- Added proper error objects, instead of just returning a message.
- Recreated setAPIVersion, to use findPossibleRoutes.

### 1.0 (5.2022.08.07)
- Added EventEmitter.
- Now supports web socket, you can listen to an event with Interact.ws.on(“event”, callback).
- Added Interact.startWS().
- Started UserCache and PostCache classes.
- Started Interact.get().

### 1.0 (6.2022.08.08)
- Added readme.md (not done).
    - added some examples of usage.
    - added version history to file.
- Removed old code (from b1).
- Moved test to a new file.
- Added a defaultVersion.
- At each error, it tells you which function its from running.
- Wrote code in UserCache (will take a input from the server, and put it into a slightly nicer format).
- You can now activate userLogin.
    - It will now also create a new UserCache and save it in Interact.userCache.
    - It will save the headerTokens assigned with the user.
- Created a Interact.saveCache test function.
- Checks for an error after Interact.findPossibleRoutes().
- Connection Class for ws, now takes in Interact class, which will keep the other data.

### 1.0 (7.2022.08.11)
- Added type 11, for "ready".
- New Connection.emitMessage, which emits to whoever is listening, instead of being built into the ws.on(message).
- added Connection.send, which can send a message to the server.
- Started InteractGroups Class, which will be used for group Dms.
- Connection now sends auth tokens when it is requested to do so.
- Test.js will now send a message once the client is ready.
