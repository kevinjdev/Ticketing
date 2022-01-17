import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI); // connect through clusterIP service
  } catch (err) {
    console.log(err);
  }
  console.log('Connected to MongoDb');
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
