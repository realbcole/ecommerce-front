import React from 'react';
import Center from './Center';
import ProductsGrid from './ProductsGrid';

const NewProducts = ({ products, wishlist }) => {
  return (
    <div className="bg-primaryBg">
      <Center className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-primaryDark">
          Latest Products
        </h1>
        <ProductsGrid products={products} wishlist={wishlist} />
      </Center>
    </div>
  );
};

export default NewProducts;
