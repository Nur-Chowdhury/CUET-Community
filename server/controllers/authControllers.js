import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    console.log("hi");
    
    const {
        firstName,
        lastName,
        userName,
        studentID,
        email,
        currentIns,
        password,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !userName ||
        !studentID ||
        !email ||
        !password ||
        firstName === '' ||
        lastName === '' ||
        userName === '' ||
        studentID === '' ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400, 'All fields are required'));
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        userName,
        studentID,
        email,
        currentIns,
        password: hashedPassword,
      });

      try {
        await newUser.save();
        res.json('Signup successful');
      } catch (error) {
        next(error);
      }
}

export const signin = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({email});

    if(!validUser){
      return next(errorHandler(401, 'Invalid Credintials!'));
    }

    const validPass = bcryptjs.compareSync(password, validUser.password);

    if (!validPass) {
      return next(errorHandler(401, 'Invalid Credintials!'));
    }

    const token = jwt.sign(
      {id: validUser.studentID},
      process.env.JWT_SECRET
    );


    const {password: pass, ...rest} = validUser._doc;

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

    rest.contactList = contactList;

    res
      .status(200)
      .cookie('access_token', token,{
        httpOnly: true,
      })
      .json(rest);

  } catch (error) {
    next(error);
  }
}