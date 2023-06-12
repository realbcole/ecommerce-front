import { NextApiHandler } from 'next';
import { mongooseConnect } from '../../lib/mongoose';
import { Category } from '../../models/Category';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Fetch categories
  if (req.method === 'GET') {
    const { ids } = req.query;

    // If ids are provided, fetch categories by ids
    if (ids) {
      res.json(await Category.find({ _id: ids }));
    }
    // If not, fetch all categories
    else {
      res.json(await Category.find());
    }
  }
};

export default handler;
