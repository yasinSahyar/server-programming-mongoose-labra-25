import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CustomError from '../classes/CustomError';
dotenv.config();

const mongoConnect = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new CustomError('Database url not found in .env file', 500);
    }
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log('DB connected successfully');
    return connection;
  } catch (error) {
    console.error('Connection to db failed: ', (error as Error).message);
  }
};

export default mongoConnect;
