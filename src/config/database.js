import mongoose from 'mongoose';

const database = () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  return mongoose.connect(mongoUri);
};

export default database;