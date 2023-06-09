import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsFlex from '@/components/ProductsFlex';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';

const CategoriesPage = ({ mainCategories, categoriesProducts, wishlist }) => {
  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <h1 className="mt-24 mb-8 text-4xl font-extrabold text-center md:text-left">
            All Categories
          </h1>
          {mainCategories?.map((category) => (
            <div key={category._id} className="mb-8">
              <h1 className="text-2xl font-bold my-2 mr-2 text-center md:text-left">
                {category.name}
              </h1>
              <ProductsFlex
                products={categoriesProducts[category?._id]}
                wishlist={wishlist}
                category={category}
                left
              />
            </div>
          ))}
        </Center>
      </div>
    </>
  );
};

export default CategoriesPage;

export async function getServerSideProps(ctx) {
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
      { 'category._id': categoriesIds },
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
