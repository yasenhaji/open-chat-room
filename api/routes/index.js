import express from 'express';
import rooms from './rooms';

const router = express.Router();

router.use(express.json());

router.use('/rooms', rooms);

export default router;