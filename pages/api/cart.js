import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handler(req, res) {
  // Connect to database
  await mongooseConnect();

  // Fetch products in cart
  const ids = req.body.ids;
  res.json(await Product.find({ _id: ids }));
}
