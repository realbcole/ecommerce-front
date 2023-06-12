import { NextApiHandler } from 'next';
import { mongooseConnect } from '../../lib/mongoose';
import { Settings } from '../../models/Settings';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Fetch settings
  if (req.method === 'GET') {
    const { name } = req.query;
    res.json(await Settings.findOne({ name }));
  }
};

export default handler;
