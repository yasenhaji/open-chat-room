# Open Chat Room

Open chat room is a multiple chat room application based on : **NextJs**, **ExpressJs**, **MongooDB**, **Immer**, **WS**(webSocket), **Material-ui**

![Open new chat room](https://github.com/yasenhaji/open-chat-room/blob/master/screenshots/open_room.PNG "Open new chat room")![Join chat room](https://github.com/yasenhaji/open-chat-room/blob/master/screenshots/join_room.PNG "Join chat room")![Chat room](https://github.com/yasenhaji/open-chat-room/blob/master/screenshots/chat_room.PNG "Chat room")

## Getting started

### API
`cd ./api`
#### Installation
`yarn install`
or
`npm install`
#### Configuration
Set your environment settings into *.env* file at the root of the project :

    DB_CONNECTION_URL="mongodb://localhost:27017/openchat"
    PORT=3001
    MONGO_USERNAME=test
    MONGO_PASSWORD=test

#### Run for development
`yarn dev`
or
`npm run dev`
#### Run for production
`yarn start`
or
`npm run start`


### WebSocket Server
`cd ./wss`
#### Installation
`yarn install`
or
`npm install`
#### Configuration
Set your environment settings into *.env* file at the root of the project :

    SSL_CERT=test_path
    SSL_KEY=test_path
    SECURE=false
    PORT=5001

#### Run for development
`yarn dev`
or
`npm run dev`
#### Run for production
`yarn start`
or
`npm run start`



### FRONT
`cd ./front`
#### Installation
`yarn install`
or
`npm install`
#### Configuration
Set your environment settings into *.env* file at the root of the project :

    PORT=3000
    API_BASE_URL=http://localhost:3001
    WSS_BASE_URL=ws://localhost:5001

#### Run for development
`yarn dev`
or
`npm run dev`
#### Build for production
`yarn build`
or
`npm run build`
#### Run for production
`yarn start`
or
`npm run start`
