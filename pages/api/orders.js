import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  // Connect to database
  await mongooseConnect();

  // Get session
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  // Fetch orders
  res.json(
    await Order.find({ userEmail: user?.email }, null, {
      sort: { createdAt: -1 },
    })
  );
}
