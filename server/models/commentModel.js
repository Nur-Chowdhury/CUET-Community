import mongoose from 'mongoose'; 

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: [{
      type: String,  // Storing studentID as string
    }],
  },
  { timestamps: true } 
);

commentSchema.methods.toggleLike = async function(studentID) {
  const index = this.likes.indexOf(studentID);
  if (index === -1) {
      this.likes.push(studentID);  // Add like
  } else {
      this.likes.splice(index, 1);  // Remove like
  }
  await this.save();
}

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;