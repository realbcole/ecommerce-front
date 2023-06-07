import { Product } from './Product';

const { Schema, models, model } = require('mongoose');

const WishlistProductSchema = new Schema({
  userEmail: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: Product },
});

export const WishlistProduct =
  models?.WishlistProduct || model('WishlistProduct', WishlistProductSchema);
