import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
    {
      institution: { type: String, required: true },
      from: { type: Number, required: true },
      to: { type: Number},
      description: {type: String},
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    { timestamps: true }
);
 
const workSchema = new mongoose.Schema(
    {
        company: { type: String, required: true },
        from: { type: Number, required: true },
        to: { type: Number},
        position: { type: String, required: true },
        description: {type: String},
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    { timestamps: true }
)


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    studentID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    Gender:{
        type: String,
    },
    education: [educationSchema],
    work: [workSchema],

    homeTown:{
        type: String,
    },
    currentCity: {
        type: String,
    },
    profile: {
        type: String,
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

userSchema.methods.addContact = async function(senderId) {
    if (!this.contacts.includes(senderId)) {
        this.contacts.push(senderId);
        await this.save();
    }
};

const User = mongoose.model('User', userSchema);

export default User; 