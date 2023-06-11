import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsFlex from '@/components/ProductsFlex';
import Spinner from '@/components/Spinner';

// Page for a category
const CategoryPage = ({
  category,
  products: originalProducts,
  subCategories,
  wishlist,
  defaultSort,
  defaultFilters,
}) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState(originalProducts);
  const [sort, setSort] = useState(defaultSort);
  const [loading, setLoading] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Fetch products when filters or sort changes
  useEffect(() => {
    if (!filtersChanged) return;
    setLoading(true);

    // Get all category ids
    const categoryIds = [
      category._id,
      ...(subCategories?.map(({ _id }) => _id) || []),
    ];

    // Create query string
    const params = new URLSearchParams();

    // Add category ids
    params.set('categories', categoryIds.join(','));

    // Add sort
    params.set('sort', sort);

    // Add filters
    filters.forEach((filter) => {
      if (filter.value !== 'all') params.set(filter.name, filter.value);
    });

    // Fetch products
    const url = `/api/products?${params.toString()}`;
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [filters, sort, filtersChanged]);

  // Handle filter change
  function handleFilterChange(filterName, filterValue) {
    setFilters((prev) => {
      const newFilters = [...prev];
      const filterIndex = newFilters.findIndex(
        (filter) => filter.name === filterName
      );
      newFilters[filterIndex].value = filterValue;
      return newFilters;
    });
    setFiltersChanged(true);
  }

  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <div className="mt-24 flex gap-4 items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <div className="flex gap-4">
              {/* FILTERS */}
              {category.properties?.map((property) => (
                <div
                  key={property.name}
                  className="flex items-center justify-between"
                >
                  <h2 className="mr-1 text-lg">{property.name}</h2>
                  <select
                    className="bg-primaryDark text-secondaryBg rounded-md p-1"
                    value={
                      filters.find((filter) => filter.name === property.name)
                        .value
                    }
                    onChange={(e) =>
                      handleFilterChange(property.name, e.target.value)
                    }
                  >
                    <option value="all">All</option>
                    {property.values.map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <h2 className="mr-1 text-lg">Sort</h2>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setFiltersChanged(true);
                  }}
                  className="bg-primaryDark text-secondaryBg rounded-md p-1"
                >
                  <option value="price-asc">Price, Lowest First</option>
                  <option value="price-desc">Price, Highest First</option>
                  <option value="_id-desc">Newest First</option>
                  <option value="_id-asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
          {loading ? (
            <Spinner className="mt-24" />
          ) : (
            <ProductsFlex products={products} wishlist={wishlist} left />
          )}
        </Center>
      </div>
    </>
  );
};

export default CategoryPage;

// Fetch category, subcategories, products, and wishlist before page loads
// This is done server-side
export async function getServerSideProps(ctx) {
  const category = await Category.findById(ctx.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const categories = [category, ...subCategories];
  const products = await Product.find({
    'category._id': categories,
    hidden: false,
  });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = session?.user;
  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
    product: products.map((product) => product._id.toString()),
  });
  const defaultSort = '_id-desc';
  const defaultFilters = category.properties?.map((property) => ({
    name: property.name,
    value: 'all',
  }));
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      wishlist: wishlist.map((product) => product.product.toString()),
      defaultSort: JSON.parse(JSON.stringify(defaultSort)),
      defaultFilters: JSON.parse(JSON.stringify(defaultFilters)),
    },
  };
}
