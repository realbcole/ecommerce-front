import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export default async function handler(req, res) {
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
}
