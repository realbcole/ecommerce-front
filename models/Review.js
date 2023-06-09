import { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema(
  {
    userName: String,
    title: String,
    description: String,
    rating: Number,
    product: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Review = models?.Review || model('Review', ReviewSchema);
