# Open Chat Room

Open chat room is a multiple chat room application based on : **NextJs**, **ExpressJs**, **MongooDB**, **Immer**, **WS**(webSocket), **Material-ui**

![Open new chat room](/screenshots/open_room.png "Open new chat room")![Join chat room](/screenshots/join_room.png "Join chat room")![Chat room](/screenshots/chat_room.png "Chat room")

## Getting started

### Installation
`yarn install`
or
`npm install`
### Configuration
Set your environment settings into *.env* file at the root of the project :

    PORT=3000
    WSS_HOST=localhost
    WSS_PORT=5001
    DB_CONNECTION_URL="mongodb://localhost:27017/openchat"

### Run for development
`yarn dev`
of
`npm run dev`
### Build for production
`yarn build`
of
`npm run build`
### Run for production
`yarn start`
of
`npm run start`
