import mongoose from 'mongoose';

// Connect to MongoDB
export const mongooseConnect = async () => {
  const uri = process.env.MONGODB_URI;
  mongoose.connection.readyState === 1
    ? mongoose.connection.asPromise()
    : mongoose.connect(uri);
};
