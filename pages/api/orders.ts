import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { mongooseConnect } from '../../lib/mongoose';
import { Order } from '../../models/Order';
import { NextApiHandler } from 'next';
import { Session, User } from '../../types';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Get session
  const session: Session = await getServerSession(req, res, authOptions);
  const user: User = session?.user;

  // Fetch orders
  res.json(
    await Order.find({ userEmail: user?.email }, null, {
      sort: { createdAt: -1 },
    })
  );
};

export default handler;
