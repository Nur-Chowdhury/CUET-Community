import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
    },
    likes: [{
        type: String,  // Storing studentID as string
    }], 
},{ timestamps: true }
);

postSchema.methods.toggleLike = async function(studentID) {
    const index = this.likes.indexOf(studentID);
    if (index === -1) {
        this.likes.push(studentID);  // Add like
    } else {
        this.likes.splice(index, 1);  // Remove like
    }
    await this.save();
} 

const Post = mongoose.model('Post', postSchema);


export default Post;