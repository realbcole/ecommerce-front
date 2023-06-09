import React from 'react';
import Center from './Center';
import Image from 'next/image';
import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';
import FlyingCartButton from './FlyingCartButton';

const Featured = ({ product }) => {
  return (
    <div className="bg-primaryDark pt-24 md:py-[5vh]">
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-featured gap-10 text-center">
          <RevealWrapper className="relative flex justify-end items-end min-h-[300px]">
            <Image
              src={product.images[0]}
              alt="Product image"
              fill
              style={{ objectFit: 'contain' }}
            />
          </RevealWrapper>
          <RevealWrapper origin="right">
            <div className="pb-24 md:py-48">
              <h1 className="font-semibold text-secondaryBg text-4xl">
                {product.title}
              </h1>

              <p className="text-secondaryBg/50 my-6">{product.description}</p>

              <div className="flex gap-4 items-center justify-center">
                <Link
                  href={{
                    pathname: '/product/[id]',
                    query: { id: product._id },
                  }}
                  className="py-1 px-2 rounded-md text-primaryDark bg-secondaryBg"
                >
                  <p className="text-lg">Read More</p>
                </Link>
                <FlyingCartButton
                  src={product.images[0]}
                  productId={product._id}
                  text
                  solid
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
