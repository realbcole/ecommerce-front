import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { mongooseConnect } from '../lib/mongoose';
import { WishlistProduct } from '../models/WishlistProduct';
import { Category } from '../models/Category';
import { Settings } from '../models/Settings';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import ChevronUpIcon from '../components/icons/ChevronUpIcon';
import Center from '../components/Center';
import Header from '../components/Header';
import ProductsFlex from '../components/ProductsFlex';
import Spinner from '../components/Spinner';
import { RevealWrapper } from 'next-reveal';
import { Product } from '../models/Product';
import {
  Filter,
  GetServerSideProps,
  ProductType,
  CategoryType,
  WishlistProductType,
  User,
  ProductsPageProps,
} from '../types';

// Products page component
const ProductsPage: React.FC<ProductsPageProps> = ({
  categories: existingCategories,
  wishlist: existingWishlist,
  defaultFilters,
  allProducts,
  shopName,
}) => {
  const [searchPrompt, setSearchPrompt] = useState<string>('');
  const [products, setProducts] = useState<ProductType[]>(allProducts);
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState<Filter>({
    name: '',
    value: '',
  });
  const [sort, setSort] = useState<string>('_id-desc');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories: CategoryType[] = existingCategories;
  const wishlist: string[] = existingWishlist;
  const debouncedSearch: Function = useCallback(
    debounce(searchProducts, 500),
    []
  );
  const isFirstRender: { current: boolean } = useRef(true);

  // On search, sort or filter change, fetch products
  useEffect(() => {
    if (!isFirstRender.current) {
      debouncedSearch(sort, searchPrompt, filters);
    }
    isFirstRender.current = false;
  }, [searchPrompt, sort, filters]);

  // Search products
  async function searchProducts(
    sort: string,
    searchPrompt: string = '',
    filters: Filter[] = []
  ) {
    setIsLoading(true);

    // Create query string
    const params: URLSearchParams = new URLSearchParams();

    // Add query params
    if (searchPrompt.trim() !== '')
      params.set('search', encodeURIComponent(searchPrompt));
    params.set('sort', sort);
    params.set('searchPage', 'true');
    filters.forEach((filter) => {
      if (filter.value !== 'all') {
        params.set(filter.name, filter.value);
        params.set('category._id', filter.category);
      }
    });
    const url: string = `/api/products?${params.toString()}`;

    // Fetch products
    await axios.get(url).then((res) => {
      setProducts(res.data);
      setIsLoading(false);
    });
  }

  // Handle filter change
  function handleFilterChange(
    filterCategory: string,
    filterName: string,
    filterValue: string
  ) {
    setFilters((prev) => {
      const newFilters: Filter[] = [...prev];
      const filterIndex: number = [...prev].findIndex(
        (filter) =>
          filter.category === filterCategory && filter.name === filterName
      );
      newFilters[filterIndex].value = filterValue;
      return newFilters;
    });
  }

  // Handle open filter
  function handleOpenFilter(categoryName: string) {
    setFiltersOpen((prev) => {
      const newFiltersOpen: Filter = { ...prev };
      newFiltersOpen[categoryName] = !newFiltersOpen[categoryName];
      return newFiltersOpen;
    });
  }

  return (
    <>
      <Header shopName={shopName} />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <RevealWrapper className="flex" delay={20}>
            {/* Search input */}
            <input
              className="mt-24 mb-4 px-4 py-2 border border-primaryDark text-center rounded-full w-full bg-secondaryBg text-primaryDark placeholder:text-primaryDark/75"
              placeholder="Search for products..."
              autoFocus
              onChange={(e) => setSearchPrompt(e.target.value)}
            />
          </RevealWrapper>
          {/* Filters */}
          <RevealWrapper
            className="flex items-center justify-center"
            delay={20}
          >
            <button onClick={() => handleOpenFilter('openAllFilters')}>
              <h2 className="mr-2 text-xl flex items-center font-semibold">
                Filters
                {filtersOpen['openAllFilters'] ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )}
              </h2>
            </button>
            <div className="flex items-center">
              <h2 className="mr-1 text-xl font-semibold">Sort</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-primaryDark text-secondaryBg rounded-md p-1"
              >
                <option value="price-asc">Price, Lowest First</option>
                <option value="price-desc">Price, Highest First</option>
                <option value="_id-desc">Newest First</option>
                <option value="_id-asc">Oldest First</option>
              </select>
            </div>
          </RevealWrapper>
          {filtersOpen['openAllFilters'] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 mb-4 gap-4 p-4 rounded-md bg-primaryDark">
              {categories.length > 0 &&
                categories.map((category) => (
                  <div key={category._id}>
                    {category.properties?.length > 0 && (
                      <div
                        key={category?._id}
                        className="flex flex-col items-center justify-start"
                      >
                        <button onClick={() => handleOpenFilter(category.name)}>
                          <h1 className="text-xl flex items-center text-secondaryBg">
                            {category.name}
                            {filtersOpen[category.name] ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )}
                          </h1>
                        </button>

                        {filtersOpen[category.name] &&
                          category.properties?.map((property) => (
                            <div
                              key={property.name}
                              className="flex items-center"
                            >
                              <h2 className="m-2 text-sm text-secondaryBg">
                                {property.name}
                              </h2>
                              <select
                                className="bg-secondaryBg text-primaryDark rounded-md p-1"
                                value={
                                  filters.find(
                                    (filter) =>
                                      filter?.name === property?.name &&
                                      filter?.category === category.name
                                  )?.value
                                }
                                onChange={(e) =>
                                  handleFilterChange(
                                    category._id,
                                    property.name,
                                    e.target.value
                                  )
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
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
          {/* Products */}
          <div className="mt-4">
            {isLoading ? (
              <Spinner className="mt-16" />
            ) : (
              <>
                {products?.length > 0 ? (
                  <ProductsFlex products={products} wishlist={wishlist} />
                ) : (
                  <RevealWrapper className="text-center mt-16" delay={20}>
                    No products found
                  </RevealWrapper>
                )}
              </>
            )}
          </div>
        </Center>
      </div>
    </>
  );
};

export default ProductsPage;

export async function getServerSideProps(ctx: GetServerSideProps) {
  await mongooseConnect();
  const session: Session | null = await getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  const user: User = session?.user;
  const wishlist: WishlistProductType[] = await WishlistProduct.find({
    userEmail: user?.email,
  });
  const categories: CategoryType[] = await Category.find();
  const defaultFilters: Filter[] = [];
  for (const category of categories) {
    category.properties?.map((property) => {
      const filter: Filter = {
        category: category._id,
        name: property.name,
        value: 'all',
      };
      defaultFilters.push(filter);
    });
  }
  const products: ProductType[] = await Product.find({ hidden: false }, null, {
    sort: { createdAt: 1 },
  });

  const shopName: { name: string; value: string } = await Settings.findOne({
    name: 'shopName',
  });

  return {
    props: {
      wishlist: JSON.parse(
        JSON.stringify(wishlist.map((product) => product.product.toString()))
      ),
      categories: JSON.parse(JSON.stringify(categories)),
      defaultFilters: JSON.parse(JSON.stringify(defaultFilters)),
      allProducts: JSON.parse(JSON.stringify(products)),
      shopName: JSON.parse(JSON.stringify(shopName?.value)),
    },
  };
}
