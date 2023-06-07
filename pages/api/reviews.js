import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'POST') {
    const { title, rating, description, product } = req.body;
    res.json(await Review.create({ title, rating, description, product }));
  }

  if (req.method === 'GET') {
    const { product } = req.query;
    res.json(
      await Review.find({ product: product }, null, { sort: { createdAt: -1 } })
    );
  }
}
