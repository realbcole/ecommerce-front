import React from 'react';
import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';
import ProductBox from './ProductBox';

// Products flex component
// Used to display product boxes in a flex layout
const ProductsFlex = ({ products, category, wishlist, left = false }) => {
  return (
    <div
      className={`flex flex-row flex-wrap gap-8 justify-center ${
        left && 'md:justify-start'
      }`}
    >
      {products?.length > 0 &&
        products.map((product, index) => (
          <RevealWrapper key={product._id} delay={20}>
            <ProductBox
              product={product}
              inWishlist={wishlist.includes(product._id)}
            />
          </RevealWrapper>
        ))}
      {/* If category page, display show all box at the end */}
      {category && (
        <RevealWrapper delay={20}>
          <Link
            href={`/category/${category._id}`}
            className="bg-primaryDark text-secondaryBg rounded-lg flex justify-center items-center h-[268px] w-[275px]"
          >
            Show all
          </Link>
        </RevealWrapper>
      )}
    </div>
  );
};

export default ProductsFlex;
