import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const { ids } = req.query;
    if (ids) {
      res.json(await Category.find({ _id: ids }));
    } else {
      res.json(await Category.find());
    }
  }
}
