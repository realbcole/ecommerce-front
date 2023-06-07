import Center from '@/components/Center';
import Header from '@/components/Header';
import { authOptions } from '../api/auth/[...nextauth]';
import ProductsGrid from '@/components/ProductsGrid';
import Spinner from '@/components/Spinner';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { WishlistProduct } from '@/models/WishlistProduct';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';

const CategoryPage = ({
  category,
  products: originalProducts,
  subCategories,
  wishlist,
}) => {
  const defaultSort = '_id-desc';
  const defaultFilters = category.properties?.map((property) => ({
    name: property.name,
    value: 'all',
  }));
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState(originalProducts);
  const [sort, setSort] = useState(defaultSort);
  const [loading, setLoading] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prev) => {
      const newFilters = [...prev];
      const filterIndex = newFilters.findIndex(
        (filter) => filter.name === filterName
      );
      newFilters[filterIndex].value = filterValue;
      return newFilters;
    });
    setFiltersChanged(true);
  };

  useEffect(() => {
    if (!filtersChanged) return;
    setLoading(true);
    const categoryIds = [
      category._id,
      ...(subCategories?.map(({ _id }) => _id) || []),
    ];

    const params = new URLSearchParams();
    params.set('categories', categoryIds.join(','));
    params.set('sort', sort);
    filters.forEach((filter) => {
      if (filter.value !== 'all') params.set(filter.name, filter.value);
    });
    const url = `/api/products?${params.toString()}`;
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [filters, sort, filtersChanged]);

  return (
    <>
      <Header />
      <Center>
        <div className="mt-24 flex gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <div className="flex gap-4">
            {category.properties?.map((property) => (
              <div
                key={property.name}
                className="flex items-center justify-between"
              >
                <h2 className="mr-1">{property.name}</h2>
                <select
                  className="bg-primaryGray rounded-md"
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
              <h2 className="mr-1">Sort</h2>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setFiltersChanged(true);
                }}
                className="bg-primaryGray rounded-md"
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
          <div className="flex justify-center items-center mt-24">
            <Spinner />
          </div>
        ) : (
          <ProductsGrid products={products} wishlist={wishlist} />
        )}
      </Center>
    </>
  );
};

export default CategoryPage;

export async function getServerSideProps(ctx) {
  const category = await Category.findById(ctx.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const categoryObject = {
    _id: category._id,
    name: category.name,
    parent: category.parent,
    properties: category.properties,
  };
  const subCategoriesObjects = subCategories.map((category) => {
    return {
      _id: category._id,
      name: category.name,
      parent: category.parent,
      properties: category.properties,
    };
  });
  const categories = [categoryObject, ...subCategoriesObjects];
  const products = await Product.find({ category: categories });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = session?.user;
  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
    product: products.map((product) => product._id.toString()),
  });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      wishlist: wishlist.map((product) => product.product.toString()),
    },
  };
}
