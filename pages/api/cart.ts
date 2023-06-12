import { NextApiHandler } from 'next';
import { mongooseConnect } from '../../lib/mongoose';
import { Product } from '../../models/Product';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Fetch products in cart
  const ids: string[] = req.body.ids;
  res.json(await Product.find({ _id: ids }));
};

export default handler;
