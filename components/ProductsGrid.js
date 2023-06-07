import { RevealWrapper } from 'next-reveal';
import React from 'react';
import ProductBox from './ProductBox';
import Link from 'next/link';

const ProductsGrid = ({ products, category, wishlist }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}>
      {products?.length > 0 &&
        products.map((product, index) => (
          <RevealWrapper key={product._id} delay={100 * index}>
            <ProductBox
              product={product}
              inWishlist={wishlist.includes(product._id)}
            />
          </RevealWrapper>
        ))}
      {category && (
        <RevealWrapper delay={50 * products.length}>
          <Link
            href={`/category/${category._id}`}
            className="bg-primaryGray rounded-lg flex justify-center items-center min-h-[200px]"
          >
            Show all
          </Link>
        </RevealWrapper>
      )}
    </div>
  );
};

export default ProductsGrid;
