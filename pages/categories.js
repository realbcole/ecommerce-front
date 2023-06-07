import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner';

const CategoriesPage = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categoriesProducts, setCategoriesProducts] = useState({});
  const [categoriesWishlist, setCategoriesWishlist] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMainCategories();
  }, []);

  async function loadMainCategories() {
    setIsLoading(true);
    await axios.get('/api/categories').then(async (response) => {
      const categories = response.data;
      const mainCategories = categories.filter((category) => !category.parent);
      setMainCategories(mainCategories);
      for (const mainCategory of mainCategories) {
        const mainCategoryId = mainCategory._id;
        const childCategoryIds = categories
          .filter(
            (category) =>
              category?.parent?.toString() === mainCategoryId.toString()
          )
          .map((category) => category._id);
        const categoriesIds = [mainCategoryId, ...childCategoryIds];
        await axios
          .get(`/api/products?categories=${categoriesIds}&limit=3`)
          .then((response) => {
            const products = response.data;
            const key = mainCategory._id.toString();
            setCategoriesProducts((prev) => ({
              ...prev,
              [key]: products,
            }));
          });
        await axios.get('/api/wishlist').then((response) => {
          const key = mainCategory._id.toString();
          setCategoriesWishlist((prev) => ({
            ...prev,
            [key]: response.data.map((product) => product?.product?.toString()),
          }));
        });
      }
      setIsLoading(false);
    });
  }

  return (
    <>
      <Header />
      <Center>
        <h1 className="mt-24 text-3xl font-extrabold">All Categories</h1>
        {isLoading ? (
          <div className="flex justify-center items-center mt-24">
            <Spinner />
          </div>
        ) : (
          <>
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
          </>
        )}
      </Center>
    </>
  );
};

export default CategoriesPage;
