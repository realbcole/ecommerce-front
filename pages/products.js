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
              className="mt-24 mb-4 px-4 py-2 border border-primaryDark rounded-full w-full bg-secondaryBg text-primaryDark placeholder:text-primaryDark/75"
              placeholder="Search for products..."
              autoFocus
              onChange={(e) => setSearchPrompt(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <h2 className="mr-1 text-lg">Sort</h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-primaryDark text-primaryBg rounded-md p-1"
            >
              <option value="price-asc">Price, Lowest First</option>
              <option value="price-desc">Price, Highest First</option>
              <option value="_id-desc">Newest First</option>
              <option value="_id-asc">Oldest First</option>
            </select>
          </div>
          <div className="flex flex-wrap justify-start items-start my-4 gap-4">
            {categories.length > 0 &&
              categories.map((category) => (
                <div
                  key={category?._id}
                  className="flex flex-col items-start justify-center"
                >
                  <h1 className="text-xl font-bold flex items-center">
                    {category.name}
                    <button onClick={() => handleOpenFilter(category.name)}>
                      {filtersOpen[category.name] ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </button>
                  </h1>
                  {filtersOpen[category.name] &&
                    category.properties?.map((property) => (
                      <div key={property.name} className="flex items-center">
                        <h2 className="m-1 text-lg">{property.name}</h2>
                        <select
                          className="bg-primaryDark text-primaryBg rounded-md p-1"
                          value={
                            filters.find(
                              (filter) => filter?.name === property?.name
                            )?.value
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
                </div>
              ))}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center mt-16">
              <Spinner />
            </div>
          ) : (
            <ProductsFlex
              products={products}
              wishlist={wishlist.map((product) => product?.product)}
              left
            />
          )}
        </Center>
      </div>
    </>
  );
};

export default SearchPage;

export async function getServerSideProps(ctx) {
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
