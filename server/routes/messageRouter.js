import express from 'express';
import {varifyToken} from '../utils/varifyUser.js'

import {addMessage, getAllMessage} from '../controllers/messageControllers.js';

const router = express.Router();

router.post('/addMessage', varifyToken, addMessage);
router.post('/getAllMessages', varifyToken, getAllMessage);

export default router;