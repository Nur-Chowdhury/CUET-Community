import {errorHandler} from '../utils/errorHandler.js';
import User from '../models/userModel.js'
import Post from '../models/postModel.js'


export const signout = (req, res, next) => {
    try {
        res.
            clearCookie('access_token')
            .status(200)
            .json('Signed Out Successfully!')
    } catch (error) {
        next(error);
    } 
}

export const findUserById = async (req, res, next) => { 

    if(!req.user){
        return next(errorHandler(403, "Please Sign In!"))
    }

    try {
        const id = req.params.id;
        const user = await User.findOne({studentID: id});
        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error); 
    }
}

export const find = async (req, res, next) => {
    if(!req.user){
        return next(errorHandler(403, "Please Sign In!"))
    }

    const { searchTerm, searchType } = req.query;
    if(searchType==1){
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;

            const users = await User.find({
                ...(searchTerm && {
                $or: [
                    { firstName: { $regex: searchTerm, $options: 'i' } },
                    { lastName: { $regex: searchTerm, $options: 'i' } },
                    { userName: { $regex: searchTerm, $options: 'i' } },
                ],
                })
            }).skip(startIndex).limit(limit);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
    else if(searchType==2){
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;

            const users = await User.find({
                ...(searchTerm && {
                $or: [
                    { 'education.institution' : { $regex: searchTerm, $options: 'i' } },
                ],
                })
            }).skip(startIndex).limit(limit);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
    else if(searchType==3){
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;

            const users = await User.find({
                ...(searchTerm && {
                $or: [
                    { 'work.company' : { $regex: searchTerm, $options: 'i' } },
                ],
                })
            }).skip(startIndex).limit(limit);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
    else if(searchType==4){
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;

            const posts = await Post.find({
                ...(searchTerm && {
                $or: [
                    { slug : { $regex: searchTerm, $options: 'i' } },
                ],
                })
            }).skip(startIndex).limit(limit);
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}

export const updateUser = async (req, res, next) => {

    const id = req.params.userId;
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    const {row, data, type} = req.body;
    if(type == "update"){
        try {
            const user = await User.findOne({studentID: id})
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    [row]: data,
                },
                {new: true}
            );
            const { password, ...rest } = updatedUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
    }
    else{
        const user = await User.findOne({studentID: id});
        data.user = user._id;
        if(row=='education'){
            
            try {
                user.education.push(data);
                await user.save();
                const updatedUser = await User.findById(user._id);
                const { password, ...rest } = updatedUser._doc;
                res.status(200).json(rest);
            } catch (error) {
                next(error);
            }
        }
        else if(row=='work'){
            try {
                user.work.push(data);
                await user.save();
                const updatedUser = await User.findById(user._id);
                const { password, ...rest } = updatedUser._doc;
                res.status(200).json(rest);
            } catch (error) {
                next(error);
            }
        }
    }
}