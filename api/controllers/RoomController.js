import RoomRepository from '../models/repositories/RoomRepository';

function createRoom(req, res) {
    console.log(req.body);
    const {subject, name, email} = req.body;

  RoomRepository.create({subject, name, email})
    .then((room) => {
        res.json(room);
    })
    .catch((err) => {
        res.status(500).json({
            err
        });
    })
}

function getRoom(req, res) {
    RoomRepository.findById(req.params.id, (err, room) => {
        if (err) {
            res.status(500).json({
                err
            });
        }
        res.json(room);
    });
}

export default { createRoom, getRoom };