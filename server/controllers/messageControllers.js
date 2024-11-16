import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import mongoose from 'mongoose';

export const addMessage = async (req, res, next) => {

    if(!req.user){
        return next(errorHandler(403, "Please Sign In!"))
    }

    const {from, to, message, image} = req.body;
    if (from !== req.user.id) {
        return next(
          errorHandler(403, 'You are not allowed to send this message!')
        );
    }
    const a = await User.findOne({studentID: from});
    const b = await User.findOne({studentID: to});
    if(message){
        const newMessage = new Message({
            message: { text: message},
            users: [a._id, b._id],
            sender: a._id,
        });
        try {
            const savedMessage = await newMessage.save();
            await b.addContact(a._id);
            await a.addContact(b._id);

            const sender = await User.findById(a._id);

            const {password: pass, ...rest} = sender._doc;

            const contactList = [];
            for (const contact of rest.contacts) {
                const usr = await User.findById(contact.toString());
                if (usr) {
                    contactList.push({
                        userName: usr.userName,
                        profile: usr.profile,
                        studentID: usr.studentID,
                    }); 
                }
            }

            res.status(201).json(contactList);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    if(image){
        const newMessage = new Message({
            message: { image},
            users: [a._id, b._id],
            sender: a._id,
        });
        try {
            const savedMessage = await newMessage.save();
            res.status(201).json(savedMessage);
        } catch (error) {
            next(error);
        }
    }
}; 

export const getAllMessage = async (req, res, next) => {

    if(!req.user){
        return next(errorHandler(403, "Please Sign In!"))
    }

    try {
        const { from, to } = req.body;

        const a = await User.findOne({studentID: from});
        const b = await User.findOne({studentID: to}); 

        const messages = await Message.find({
            users: {
                $all: [a._id, b._id],
            },
        }).sort({ updatedAt: 1 });


        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === a._id.toString(),
                message: msg.message.text,
            };
        });

        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};