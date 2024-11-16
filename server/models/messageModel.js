import mongoose from 'mongoose'; 

const messageSchema = new mongoose.Schema({
    message: {
        text:{
            type: String,
        },
        image:{ 
            type: String, 
        },
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
},{timestamps: true,});

const Message = mongoose.model('Messages', messageSchema);

export default Message;