import mongoose, { Schema, model, models } from 'mongoose';

const AccountDetailsSchema = new Schema({
  userEmail: { type: String, unique: true, required: true },
  name: String,
  email: String,
  streetAddress: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

export const AccountDetails =
  models?.AccountDetails ||
  mongoose.model('AccountDetails', AccountDetailsSchema);
