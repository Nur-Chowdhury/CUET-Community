import express from 'express';

import {signout, findUserById, find, updateUser} from '../controllers/userContorllers.js'

import {varifyToken} from '../utils/varifyUser.js'

const router = express.Router();

router.post('/signout', signout);
router.get('/findUserById/:id', varifyToken, findUserById);
router.get('/find/users', varifyToken, find);
router.put('/update/:userId', varifyToken, updateUser); 

export default router;