import React from 'react';
import Center from './Center';
import ProductsFlex from './ProductsFlex';
import { NewProductsProps } from '../types';

// NewProducts component
// Used to display new products on home page
const NewProducts: React.FC<NewProductsProps> = ({ products, wishlist }) => {
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
