require('dotenv').config();
const express = require('express')
const next = require('next')
const mongoose = require('mongoose');
const db_connection_url = process.env.DB_CONNECTION_URL;
const port = parseInt(process.env.PORT, 10) || 3000;
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

  server.get('/room/:id/:name', (req, res) => {
    const {id, name} = req.params;
    return app.render(req, res, '/room', {
      roomId: id, 
      name,
      port: parseInt(process.env.PORT, 10) || 80,
      wssPort: parseInt(process.env.WSS_PORT, 10) || 5001,
      wssHost: process.env.WSS_HOST || "localhost"
    });
  })

  server.get('/room/:id/', (req, res) => {
    const {id} = req.params;
    return app.render(req, res, '/', {
      roomId: id
    });
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on https://localhost:${port}`)
  })
})

// ----------- Web Socket Server --------------------
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: parseInt(process.env.WSS_PORT, 10) || 5001 });

const uniqid = require('uniqid');

const connections = {};

let history = {};

wss.on('connection', (ws, req) => {

    const roomId = req.url.replace('/', '');

    const uid = uniqid();
    connections[uid] = {
      roomId,
      ws
    };

    if (!history[roomId]) {
      history[roomId] = [];
    }

    ws.send(JSON.stringify(
      {
        type: "OPEN",
        value: uid
      }
    ))

    ws.on('message', message => {
        const parsedMessage = JSON.parse(message);
        history[roomId].push(...parsedMessage);
        Object.values(connections)
        .filter(client => client.roomId === roomId && client.ws !== ws)
        .forEach(client => client.ws.send(
          JSON.stringify({
            type: "PATCHE",
            value: parsedMessage
          })
        ))
    })

    ws.on('close', () => {
        delete connections[uid];
        if (Object.keys(connections).length > 0) {
          connections[Object.keys(connections)[0]]
          .ws.send(JSON.stringify(
            {
              type: "CLOSE",
              value: uid
            }
          ))
        } else {
          history[roomId] = [];
        }
    })

    ws.send(JSON.stringify({
      type: "PATCHE",
      value: history[roomId]
    }))
});