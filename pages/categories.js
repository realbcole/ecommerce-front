import React from 'react';
import Link from 'next/link';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';
import { mongooseConnect } from '@/lib/mongoose';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsFlex from '@/components/ProductsFlex';
import { RevealWrapper } from 'next-reveal';

// Categories page component
const CategoriesPage = ({ mainCategories, categoriesProducts, wishlist }) => {
  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <RevealWrapper>
            <h1 className="mt-24 mb-8 text-4xl font-extrabold text-center md:text-left">
              Categories
            </h1>
          </RevealWrapper>
          {mainCategories?.map((category) => (
            <div key={category._id} className="mb-8">
              <RevealWrapper className="flex items-center mb-2">
                <Link
                  href={`/category/${category._id}`}
                  className="text-2xl font-bold text-center md:text-left flex items-center"
                >
                  {category.name}
                </Link>
                <Link
                  href={`/category/${category._id}`}
                  className="text-sm text-secondaryBg bg-primaryDark rounded-full px-2 py-1 mx-2"
                >
                  Show all
                </Link>
              </RevealWrapper>
              {categoriesProducts[category?._id].length === 3 ? (
                <ProductsFlex
                  products={categoriesProducts[category?._id]}
                  wishlist={wishlist}
                  category={category}
                  left
                />
              ) : (
                <ProductsFlex
                  products={categoriesProducts[category?._id]}
                  wishlist={wishlist}
                  left
                />
              )}
            </div>
          ))}
        </Center>
      </div>
    </>
  );
};

export default CategoriesPage;

// Fetch categories and wishlist before rendering page
export async function getServerSideProps() {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter((category) => !category.parent);
  const categoriesProducts = {};
  for (const mainCategory of mainCategories) {
    const mainCategoryId = mainCategory._id.toString();
    const childCategoryIds = categories
      .filter(
        (category) => category?.parent?.toString() === mainCategoryId.toString()
      )
      .map((category) => category._id);
    const categoriesIds = [mainCategoryId, ...childCategoryIds];
    categoriesProducts[mainCategoryId] = await Product.find(
      { 'category._id': categoriesIds, hidden: false },
      null,
      {
        limit: 3,
      }
    );
  }
  const wishlist = (await WishlistProduct.find()).map((product) => product._id);
  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishlist: JSON.parse(JSON.stringify(wishlist)),
    },
  };
}
