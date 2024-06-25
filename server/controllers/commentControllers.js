import Comment from '../models/commentModel.js';

export const createComment = async (req, res, next) => {
    const { comment, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment!')
      );
    }
    const newComment = new Comment({
      comment,
      postId,
      userId,
    });
    try{
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch(error){
      next(error);
    }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export const commentLike = async (req, res) => {
  console.log("hi");
  try {
      const comment = await Comment.findById(req.params.commentId);
      console.log(comment);
      if (!comment) {
          return res.status(404).send('Comment not found');
      }
      //console.log(req.user.id);
      await comment.toggleLike(req.user.id);  // Assuming req.user.id contains the ID of the current user
      //console.log(post);
      res.status(200).send(comment);
  } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
  }
}