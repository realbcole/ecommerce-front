import { RevealWrapper } from 'next-reveal';
import React from 'react';
import ProductBox from './ProductBox';
import Link from 'next/link';

const ProductsGrid = ({ products, category, wishlist }) => {
  return (
    <div
      className={`flex flex-row flex-wrap gap-8 justify-center  ${
        category && 'md:justify-start'
      }`}
    >
      {products?.length > 0 &&
        products.map((product, index) => (
          <RevealWrapper key={product._id} delay={50 * index}>
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
            className="bg-secondary text-primaryBg rounded-lg flex justify-center items-center h-[268px] w-[275px]"
          >
            Show all
          </Link>
        </RevealWrapper>
      )}
    </div>
  );
};

export default ProductsGrid;
