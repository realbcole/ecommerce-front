import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

const SearchPage = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);

  useEffect(() => {
    if (searchPrompt.length > 0) {
      debouncedSearch(searchPrompt);
    } else {
      debouncedSearch();
    }
  }, [searchPrompt]);

  function searchProducts(searchPrompt) {
    setIsLoading(true);
    if (searchPrompt) {
      axios
        .get(`/api/products?search=${encodeURIComponent(searchPrompt)}`)
        .then((response) => {
          setProducts(response.data);
        });
    } else {
      axios.get(`/api/products`).then((response) => {
        setProducts(response.data);
      });
    }
    axios.get('/api/wishlist').then((response) => {
      setWishlist(response.data.map((product) => product.product));
      setIsLoading(false);
    });
  }

  return (
    <>
      <Header />
      <Center>
        <input
          className="mt-24 mb-8 px-4 py-2 border border-primaryDark rounded-full w-full"
          placeholder="Search for products..."
          autoFocus
          onChange={(e) => setSearchPrompt(e.target.value)}
        ></input>
        {isLoading ? (
          <div className="flex items-center justify-center mt-8">
            <Spinner />
          </div>
        ) : (
          <ProductsGrid
            products={products}
            wishlist={wishlist.map((product) => product._id)}
          />
        )}
      </Center>
    </>
  );
};

export default SearchPage;
