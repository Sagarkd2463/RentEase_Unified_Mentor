import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/db.js';

dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL
}));


const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, ()=> {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

start();