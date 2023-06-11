import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';
import { Settings } from '@/models/Settings';
import Featured from '@/components/Featured';
import Header from '@/components/Header';
import NewProducts from '@/components/NewProducts';

// Home page component
const Home = ({ featuredProduct, newProducts, wishlist, shopName }) => {
  return (
    <>
      <Header shopName={shopName} />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishlist={wishlist} />
    </>
  );
};

// Fetch featured product, new products, wishlist, and shop name from database
// This is done server-side
export const getServerSideProps = async (ctx) => {
  await mongooseConnect();
  const feautredProductSetting = await Settings.findOne({
    name: 'featuredProductId',
  });
  const featuredProductId = feautredProductSetting?.value;
  const featuredProduct = await Product.findById(featuredProductId);
  const shopName = await Settings.findOne({ name: 'shopName' });
  const newProducts = await Product.find({}, null, {
    sort: { createdAt: -1 },
    limit: 10,
  });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = session?.user;
  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
    product: newProducts.map((product) => product._id.toString()),
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishlist: wishlist.map((product) => product.product.toString()),
      shopName: shopName?.value,
    },
  };
};

export default Home;
