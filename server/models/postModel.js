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
    }
},{ timestamps: true }
);

const Post = mongoose.model('Post', postSchema);


export default Post;