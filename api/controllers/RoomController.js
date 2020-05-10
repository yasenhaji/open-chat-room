import RoomRepository from '../models/repositories/RoomRepository';
import IdGenerator from '../services/IdGenerator';

function createRoom(req, res) {
    const {subject, email} = req.body;
    const slug = IdGenerator.generate();
    RoomRepository.create({subject, email, slug})
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
    RoomRepository.findBySlug(req.params.slug, (err, room) => {
        if (err) {
            res.status(500).json({
                err
            });
        }
        res.json(room);
    });
}

export default { createRoom, getRoom };