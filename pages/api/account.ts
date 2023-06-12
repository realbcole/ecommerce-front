import { getServerSession } from 'next-auth';
import { mongooseConnect } from '../../lib/mongoose';
import { authOptions } from './auth/[...nextauth]';
import { AccountDetails } from '../../models/AccountDetails';
import { AccountDetailsType, Session, User } from '../../types';
import { NextApiHandler } from 'next';

// API route for the account details page
const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Get session
  const session: Session = await getServerSession(req, res, authOptions);
  const user: User = session?.user;

  // Fetch account details
  const details: AccountDetailsType = await AccountDetails.findOne({
    userEmail: user?.email,
  });

  // Update account details
  if (req.method === 'PUT') {
    // If account details already exists, update it
    if (details) {
      res.json(await AccountDetails.findByIdAndUpdate(details._id, req.body));
    }
    // If not, create it
    else {
      res.json(
        await AccountDetails.create({ userEmail: user?.email, ...req.body })
      );
    }
  }

  // Fetch account details
  if (req.method === 'GET') {
    res.json(details);
  }
};

export default handler;
