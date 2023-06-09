import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { WishlistProduct } from '../../models/WishlistProduct';
import Center from '../../components/Center';
import Header from '../../components/Header';
import ProductsFlex from '../../components/ProductsFlex';
import Spinner from '../../components/Spinner';
import { RevealWrapper } from 'next-reveal';
import {
  CategoryPageProps,
  CategoryType,
  Filter,
  GetServerSideProps,
  ProductType,
  Session,
  SettingsType,
  User,
  WishlistProductType,
} from '../../types';
import { Settings } from '../../models/Settings';

// Page for a category
const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products: originalProducts,
  subCategories,
  wishlist,
  defaultSort,
  defaultFilters,
  shopName,
}) => {
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [products, setProducts] = useState<ProductType[]>(originalProducts);
  const [sort, setSort] = useState<string>(defaultSort);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);

  // Fetch products when filters or sort changes
  useEffect(() => {
    if (!filtersChanged) return;
    setLoading(true);

    // Get all category ids
    const categoryIds: string[] = [
      category._id,
      ...(subCategories?.map(({ _id }) => _id) || []),
    ];

    // Create query string
    const params: URLSearchParams = new URLSearchParams();

    // Add category ids
    params.set('categories', categoryIds.join(','));

    // Add sort
    params.set('sort', sort);

    // Add filters
    filters.forEach((filter) => {
      if (filter.value !== 'all') params.set(filter.name, filter.value);
    });

    // Fetch products
    const url: string = `/api/products?${params.toString()}`;
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [filters, sort, filtersChanged]);

  // Handle filter change
  function handleFilterChange(filterName: string, filterValue: string) {
    setFilters((prev) => {
      const newFilters: Filter[] = [...prev];
      const filterIndex: number = newFilters.findIndex(
        (filter) => filter.name === filterName
      );
      newFilters[filterIndex].value = filterValue;
      return newFilters;
    });
    setFiltersChanged(true);
  }

  return (
    <>
      <Header shopName={shopName} />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <RevealWrapper
            className="mt-24 flex gap-4 items-center justify-center mb-4 flex-col flex-wrap"
            delay={20}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primaryDark whitespace-nowrap">
              {category.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              {/* FILTERS */}
              {category.properties?.map((property) => (
                <div key={property.name} className="flex items-center">
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
          </RevealWrapper>
          {loading ? (
            <Spinner className="mt-24" />
          ) : (
            <ProductsFlex products={products} wishlist={wishlist} />
          )}
        </Center>
      </div>
    </>
  );
};

export default CategoryPage;

// Fetch category, subcategories, products, and wishlist before page loads
// This is done server-side
export async function getServerSideProps(ctx: GetServerSideProps) {
  const category: CategoryType = await Category.findById(ctx.query.id);
  const subCategories: CategoryType[] = await Category.find({
    parent: category._id,
  });
  const categories: CategoryType[] = [category, ...subCategories];
  const products: ProductType[] = await Product.find({
    'category._id': categories,
    hidden: false,
  });
  const session: Session = await getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  const user: User = session?.user;
  const wishlist: WishlistProductType[] = await WishlistProduct.find({
    userEmail: user?.email,
    product: products.map((product) => product._id.toString()),
  });
  const defaultSort: string = '_id-desc';
  const defaultFilters: Filter[] = category.properties?.map((property) => ({
    name: property.name,
    value: 'all',
  }));

  const shopName: SettingsType = await Settings.findOne({ name: 'shopName' });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      wishlist: wishlist.map((product) => product.product.toString()),
      defaultSort: JSON.parse(JSON.stringify(defaultSort)),
      defaultFilters: JSON.parse(JSON.stringify(defaultFilters)),
      shopName: JSON.parse(JSON.stringify(shopName?.value)),
    },
  };
}
