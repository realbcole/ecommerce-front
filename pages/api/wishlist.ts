import { getServerSession } from 'next-auth';
import { mongooseConnect } from '../../lib/mongoose';
import { authOptions } from './auth/[...nextauth]';
import { WishlistProduct } from '../../models/WishlistProduct';
import { NextApiHandler } from 'next';
import { Session, User, WishlistProductType } from '../../types';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Get session
  const session: Session = await getServerSession(req, res, authOptions);
  const user: User = session?.user;

  // Add or remove product from wishlist
  if (req.method === 'POST') {
    const { product } = req.body;
    // Find product in wishlist
    const wishlistDoc: WishlistProductType = await WishlistProduct.findOne({
      userEmail: user?.email,
      product,
    });

    // If product is already in wishlist, remove it
    if (wishlistDoc) {
      await WishlistProduct.findByIdAndDelete(wishlistDoc._id);
      res.json('deleted');
    }
    // If not, add it
    else {
      await WishlistProduct.create({ userEmail: user?.email, product });
      res.json('added');
    }
  }

  // Fetch wishlist
  if (req.method === 'GET') {
    res.json(
      await WishlistProduct.find({ userEmail: user?.email }).populate('product')
    );
  }
};

export default handler;
