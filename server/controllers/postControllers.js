import Post from "../models/postModel.js";
import {errorHandler} from "../utils/errorHandler.js"

export const create = async(req, res, next) => {

    const {content, image} = req.body;

    if(!req.user){
        return next(errorHandler(403, "Please Sign In!"))
    }
    if(!req.body.content){
        return next(errorHandler(400, "Please Provide some content!"));
    }
    const slug = req.body.content.split(' ').join('-').toLowerCase().replace(/[^a-zA-z0-9-]/g, '');
    const newPost = new Post({
        content,
        image,
        slug,
        userId: req.user.id,
    });

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch(error){
        next(error);
    }
}

export const getPosts = async (req, res, next) => {
    try {
      const posts = await Post.find().sort({
        createdAt: -1,
      });
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };