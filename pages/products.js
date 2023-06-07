import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';
import React from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const ProductsPage = ({ products, wishlist }) => {
  return (
    <>
      <Header />
      <Center>
        <h1 className="text-3xl font-bold mt-24 mb-8">All Products</h1>
        <ProductsGrid products={products} wishlist={wishlist} />
      </Center>
    </>
  );
};

export default ProductsPage;

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = session?.user;
  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
    product: products.map((product) => product._id.toString()),
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishlist: wishlist.map((product) => product.product.toString()),
    },
  };
}
