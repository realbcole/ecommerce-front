import { NextApiHandler } from 'next';
import { mongooseConnect } from '../../lib/mongoose';
import { Review } from '../../models/Review';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Create review
  if (req.method === 'POST') {
    const { userName, title, rating, description, product } = req.body;
    res.json(
      await Review.create({ userName, title, rating, description, product })
    );
  }

  // Fetch reviews for a product
  if (req.method === 'GET') {
    const { product } = req.query;
    res.json(
      await Review.find({ product: product }, null, { sort: { createdAt: -1 } })
    );
  }
};

export default handler;
