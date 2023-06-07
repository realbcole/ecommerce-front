import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import React from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { WishlistProduct } from '@/models/WishlistProduct';

const CategoriesPage = ({
  mainCategories,
  categoriesProducts,
  categoriesWishlist,
}) => {
  return (
    <>
      <Header />
      <Center>
        <h1 className="mt-24 text-3xl font-extrabold">All Categories</h1>
        {mainCategories?.map((category) => (
          <div key={category._id} className="mb-8">
            <h1 className="text-2xl font-bold mr-2">{category.name}</h1>
            <ProductsGrid
              products={categoriesProducts[category?._id]}
              wishlist={categoriesWishlist[category?._id]}
              category={category}
            />
          </div>
        ))}
      </Center>
    </>
  );
};

export default CategoriesPage;

export async function getServerSideProps(ctx) {
  const categories = await Category.find();
  const mainCategories = categories.filter((category) => !category.parent);
  let categoriesProducts = {};
  let categoriesWishlist = {};
  for (const mainCategory of mainCategories) {
    const mainCategoryId = mainCategory._id;
    const childCategoryIds = categories
      .filter(
        (category) =>
          category?.parent?._id.toString() === mainCategoryId.toString()
      )
      .map((category) => category._id);
    const categoriesIds = [mainCategoryId, ...childCategoryIds];
    const categoriesObjects = (await Category.find({ _id: categoriesIds })).map(
      (category) => {
        return {
          _id: category._id,
          name: category.name,
          parent: category?.parent,
          properties: category.properties,
        };
      }
    );
    const products = await Product.find({ category: categoriesObjects }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const user = session?.user;
    const wishlist = await WishlistProduct.find({
      userEmail: user?.email,
      product: products.map((product) => product._id.toString()),
    });
    categoriesProducts[mainCategory._id.toString()] = products;
    categoriesWishlist[mainCategory._id.toString()] = wishlist.map((product) =>
      product.product.toString()
    );
  }
  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      categoriesWishlist: JSON.parse(JSON.stringify(categoriesWishlist)),
    },
  };
}
