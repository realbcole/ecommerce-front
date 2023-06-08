import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  res.json(
    await Order.find({ userEmail: user?.email }, null, {
      sort: { createdAt: -1 },
    })
  );
}
