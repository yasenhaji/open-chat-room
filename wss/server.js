import fs from 'fs';
import https from 'https';
import WebSocket from 'ws';
import qs from 'qs';
import dotenv from 'dotenv';
import uniqid from 'uniqid';

dotenv.config();

const wssPort = parseInt(process.env.PORT, 10) || 5001;
let wss = null;
if (process.env.SECURE == 'true') {
  const server = https.createServer({
    cert: fs.readFileSync(process.env.SSL_CERT),
    key: fs.readFileSync(process.env.SSL_KEY)
  });
  wss = new WebSocket.Server({server});
  server.listen(wssPort);
} else {
  wss = new WebSocket.Server({port: wssPort});
}

console.log(`WSS listening on ${wssPort}...`);

const connections = {};

const sendMessage = (message, connections) => {
  connections.forEach(client => client.ws.send(
    JSON.stringify(message)
  ));
}

wss.on('connection', (ws, req) => {

    const queryString = qs.parse(req.url.replace(/\/|\?/g, ''));
    const {roomId} = queryString;
    const uid = uniqid();
    connections[uid] = {
      id: uid,
      roomId,
      ws
    };

    ws.send(JSON.stringify({
      type: "CURRENT_USER",
      value: uid
    }));

    ws.on('message', message => {
      const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'ADD_USER' || parsedMessage.type === 'SET_NAME') {
          connections[uid].name = parsedMessage.name;
          sendMessage(
              {
                type: "CONNECTED_USERS",
                users: Object.values(connections).filter(client => client.roomId === roomId)
              },
              Object.values(connections).filter(client => client.roomId === roomId)
          );
          return;
        }
        
        Object.values(connections)
        .filter(client => client.roomId === roomId && client.ws !== ws)
        .forEach(client => client.ws.send(
          message
        ));
    })

    ws.on('close', () => {
        delete connections[uid];
        sendMessage(
          {type: "CLOSE", value: uid},
          Object.values(connections).filter(client => client.roomId === roomId)
        );
    })
});