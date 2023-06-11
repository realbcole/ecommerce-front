import { getServerSession } from 'next-auth';
import { mongooseConnect } from '@/lib/mongoose';
import { authOptions } from './auth/[...nextauth]';
import { AccountDetails } from '@/models/AccountDetails';

// API route for the account details page
export default async function handler(req, res) {
  // Connect to database
  await mongooseConnect();

  // Get session
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  // Fetch account details
  const details = await AccountDetails.findOne({ userEmail: user?.email });

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
}
