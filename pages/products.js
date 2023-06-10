import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsFlex from '@/components/ProductsFlex';
import Spinner from '@/components/Spinner';
import { WishlistProduct } from '@/models/WishlistProduct';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { Category } from '@/models/Category';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import ChevronUpIcon from '@/components/icons/ChevronUpIcon';
import { mongooseConnect } from '@/lib/mongoose';

const SearchPage = ({
  categories: existingCategories,
  wishlist: existingWishlist,
  defaultFilters,
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState({});
  const [sort, setSort] = useState('_id-desc');
  const [isLoading, setIsLoading] = useState(true);

  const categories = existingCategories;
  const wishlist = existingWishlist;
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);

  useEffect(() => {
    if (searchPrompt.length > 0) {
      debouncedSearch(sort, searchPrompt);
    } else {
      debouncedSearch(sort);
    }
  }, [searchPrompt, sort, filters]);

  async function searchProducts(sort, searchPrompt) {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchPrompt) params.set('search', encodeURIComponent(searchPrompt));
    params.set('sort', sort);
    params.set('searchPage', true);
    filters.forEach((filter) => {
      if (filter.value !== 'all') params.set(filter.name, filter.value);
    });
    const url = `/api/products?${params.toString()}`;
    await axios.get(url).then((res) => {
      setProducts(res.data);
      setIsLoading(false);
    });
  }

  function handleFilterChange(filterName, filterValue) {
    console.log(filters);
    setFilters((prev) => {
      const newFilters = [...prev];
      const filterIndex = newFilters.findIndex(
        (filter) => filter.name === filterName
      );
      newFilters[filterIndex].value = filterValue;
      return newFilters;
    });
  }

  function handleOpenFilter(categoryName) {
    setFiltersOpen((prev) => {
      const newFiltersOpen = { ...prev };
      newFiltersOpen[categoryName] = !newFiltersOpen[categoryName];
      return newFiltersOpen;
    });
  }

  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <div className="flex">
            <input
              className="mt-24 mb-4 px-4 py-2 border border-primaryDark text-center rounded-full w-full bg-secondaryBg text-primaryDark placeholder:text-primaryDark/75"
              placeholder="Search for products..."
              autoFocus
              onChange={(e) => setSearchPrompt(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
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
          </div>
          {filtersOpen['openAllFilters'] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 mb-4 gap-4 p-4 rounded-full bg-primaryDark">
              {categories.length > 0 &&
                categories.map((category) => (
                  <>
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
                                    (filter) => filter?.name === property?.name
                                  )?.value
                                }
                                onChange={(e) =>
                                  handleFilterChange(
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
                  </>
                ))}
            </div>
          )}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center mt-16">
                <Spinner />
              </div>
            ) : (
              <ProductsFlex
                products={products}
                wishlist={wishlist.map((product) => product?.product)}
              />
            )}
          </div>
        </Center>
      </div>
    </>
  );
};

export default SearchPage;

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = session?.user;
  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
  });
  const categories = await Category.find();
  const defaultFilters = [];
  for (const category of categories) {
    category.properties?.map((property) => {
      const filter = { name: property.name, value: 'all' };
      defaultFilters.push(filter);
    });
  }
  return {
    props: {
      wishlist: JSON.parse(JSON.stringify(wishlist)),
      categories: JSON.parse(JSON.stringify(categories)),
      defaultFilters: JSON.parse(JSON.stringify(defaultFilters)),
    },
  };
}
