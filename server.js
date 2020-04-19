require('dotenv').config();
const express = require('express')
const next = require('next')
const mongoose = require('mongoose');
const db_connection_url = process.env.DB_CONNECTION_URL;
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const dbSchema = require('./dbSchema');


app.prepare().then(() => {
  const server = express()

  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  mongoose.connect(db_connection_url, {useNewUrlParser: true, useUnifiedTopology: true});
  
  const Room = mongoose.model('Room', dbSchema.roomSchema);

  server.post('/api/rooms', (req, res) => {

    const {subject, name, email} = req.body;

    const newRoom = new Room({admin: name, subject, email});

    newRoom.save().then((room) => {
        res.redirect(`/room/${room._id}/${room.admin}`)
    })
  })

  server.get('/api/rooms/:id', (req, res) => {
    Room.findById(req.params.id, (err, room) => {
        if (err) res.render('404', { status: 404, url: req.url });;

        res.json(room)
    });
  })

  server.get('/room/:id/', (req, res) => {
    const {id} = req.params;
    const withPort = process.env.PORT && parseInt(process.env.PORT, 10) !== 80;
    return app.render(req, res, '/room', {
      roomId: id,
      webBaseUrl: `${process.env.SECURE == 'true' ? 'https': 'http'}://${process.env.HOST || "localhost"}${withPort ? ':'+parseInt(process.env.PORT, 10) || 80 : ''}`,
      socketBaseUrl: `${process.env.SECURE == 'true' ? 'wss': 'ws'}://${process.env.HOST || "localhost"}:${parseInt(process.env.WSS_PORT, 10) || 5001 }`
    });
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

// ----------- Web Socket Server --------------------

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const wssPort = parseInt(process.env.WSS_PORT, 10) || 5001;
const qs = require('qs');
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

const uniqid = require('uniqid');

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

    // sendMessage(
    //   {type: "OPEN", id: uid},
    //   Object.values(connections).filter(client => client.roomId === roomId && client.ws !== ws)
    // );

    ws.send(JSON.stringify({
      type: "CONNECTED_USERS",
      users: Object.values(connections).filter(client => client.roomId === roomId)
    }));

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
        ))
    })

    ws.on('close', () => {
        delete connections[uid];

        sendMessage(
          {type: "CLOSE", value: uid},
          Object.values(connections).filter(client => client.roomId === roomId)
        );
    })
});