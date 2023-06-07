import { mongooseConnect } from '@/lib/mongoose';
import { authOptions } from './auth/[...nextauth]';
import { WishlistProduct } from '@/models/WishlistProduct';
import { getServerSession } from 'next-auth';

export default async function handler(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;
  if (req.method === 'POST') {
    const { product } = req.body;
    const wishlistDoc = await WishlistProduct.findOne({
      userEmail: user?.email,
      product,
    });
    if (wishlistDoc) {
      await WishlistProduct.findByIdAndDelete(wishlistDoc._id);
      res.json('deleted');
    } else {
      await WishlistProduct.create({ userEmail: user?.email, product });
      res.json('added');
    }
  }
  if (req.method === 'GET') {
    res.json(
      await WishlistProduct.find({ userEmail: user?.email }).populate('product')
    );
  }
}
