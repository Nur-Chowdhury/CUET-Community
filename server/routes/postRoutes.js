import express from 'express';
import {varifyToken} from '../utils/varifyUser.js';
import {create, getPosts} from '../controllers/postControllers.js';

const router = express.Router();
router.post('/create', varifyToken, create);
router.get('/getposts', getPosts);

export default router;