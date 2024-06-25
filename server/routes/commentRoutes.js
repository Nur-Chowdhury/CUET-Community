import express from 'express';
import {varifyToken} from '../utils/varifyUser.js'
import {commentLike, createComment, getAllComments} from  '../controllers/commentControllers.js'

const router = express.Router();

router.post('/create', varifyToken, createComment);
router.get('/getAllComments', getAllComments);
router.post('/:commentId/like', varifyToken, commentLike);

export default router;