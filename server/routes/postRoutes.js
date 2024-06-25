import express from 'express';
import {varifyToken} from '../utils/varifyUser.js';
import {create, getPosts, postLike} from '../controllers/postControllers.js';

const router = express.Router();
router.post('/create', varifyToken, create);
router.get('/getposts', getPosts);
router.post('/:postId/like', varifyToken, postLike); 

export default router;