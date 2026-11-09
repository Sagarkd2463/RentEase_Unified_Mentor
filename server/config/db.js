import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
    const connected = await mongoose.connect(process.env.MONGODB_URI);

    if(connected) {
        console.log("Database Successfully Connected....");
    } else {
        console.log("No DB Connected....");
    }
};

export default connectDatabase;