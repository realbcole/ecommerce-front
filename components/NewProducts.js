import React from 'react';
import Center from './Center';
import ProductsGrid from './ProductsGrid';

const NewProducts = ({ products, wishlist }) => {
  return (
    <Center>
      <h1 className="text-3xl font-semibold pb-[30px]">Latest Products</h1>
      <ProductsGrid products={products} wishlist={wishlist} />
    </Center>
  );
};

export default NewProducts;
