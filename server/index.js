import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commetRoutes from './routes/commentRoutes.js';
import cookieParser from "cookie-parser";
import messageRoutes from './routes/messageRouter.js'


dotenv.config();
connectToDatabase();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(5174, ()=>{
    console.log('server is up on port 5174');
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commetRoutes); 
app.use("/api/messages", messageRoutes);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});