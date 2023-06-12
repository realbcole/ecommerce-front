import React from 'react';
import Image from 'next/image';
import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';
import Center from './Center';
import FlyingCartButton from './FlyingCartButton';
import { FeaturedProps } from '../types';

// Featured component
// Used to display featured product on home page
const Featured: React.FC<FeaturedProps> = ({ product }) => {
  return (
    <div className="bg-primaryDark pt-24 md:py-[5vh]">
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-featured gap-10 text-center">
          {/* Featured product image */}
          <RevealWrapper className="relative flex justify-end items-end min-h-[300px]">
            <Image
              src={product?.images[0]}
              alt="Product image"
              fill
              style={{ objectFit: 'contain' }}
              sizes="300px"
              priority
            />
          </RevealWrapper>
          {/* Featured product info */}
          <RevealWrapper origin="right">
            <div className="pb-24 md:py-48">
              <h1 className="font-semibold text-secondaryBg text-4xl">
                {product?.title}
              </h1>
              <p className="text-secondaryBg/50 my-6">{product?.description}</p>
              {/* Featured product buttons */}
              <div className="flex gap-4 items-center justify-center">
                <Link
                  href={{
                    pathname: '/product/[id]',
                    query: { id: product?._id },
                  }}
                  className="py-1 px-2 rounded-md text-primaryDark bg-secondaryBg"
                >
                  <p className="text-lg">Read More</p>
                </Link>
                <FlyingCartButton
                  src={product?.images[0]}
                  productId={product?._id}
                  text
                />
              </div>
            </div>
          </RevealWrapper>
        </div>
      </Center>
    </div>
  );
};

export default Featured;
