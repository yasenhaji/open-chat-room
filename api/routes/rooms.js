import express from 'express';
import cors from 'cors';
import RoomController from '../controllers/RoomController';

const router = express.Router();

router.post('/', cors(), RoomController.createRoom);
router.get('/:slug', RoomController.getRoom);

export default router;