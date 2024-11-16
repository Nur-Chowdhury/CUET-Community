import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commetRoutes from './routes/commentRoutes.js';
import cookieParser from "cookie-parser";
import messageRoutes from './routes/messageRouter.js';
import path from "path";


dotenv.config();
connectToDatabase();

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 5174;

app.use(express.json());
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commetRoutes); 
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});