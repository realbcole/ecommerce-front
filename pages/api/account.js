import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { AccountDetails } from '@/models/AccountDetails';

export default async function handler(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;
  const details = await AccountDetails.findOne({ userEmail: user?.email });
  if (req.method === 'PUT') {
    if (details) {
      res.json(await AccountDetails.findByIdAndUpdate(details._id, req.body));
    } else {
      res.json(
        await AccountDetails.create({ userEmail: user?.email, ...req.body })
      );
    }
  }
  if (req.method === 'GET') {
    res.json(details);
  }
}
