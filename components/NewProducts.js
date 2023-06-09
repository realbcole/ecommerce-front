import React from 'react';
import Center from './Center';
import ProductsFlex from './ProductsFlex';

const NewProducts = ({ products, wishlist }) => {
  return (
    <div className="bg-primaryBg min-h-screen">
      <Center>
        <h1 className="text-3xl font-bold mb-8 text-primaryDark text-center">
          New Arrivals
        </h1>
        <ProductsFlex products={products} wishlist={wishlist} />
      </Center>
    </div>
  );
};

export default NewProducts;
