import React from 'react';
import Center from './Center';
import Image from 'next/image';
import { RevealWrapper } from 'next-reveal';
import Link from 'next/link';
import FlyingCartButton from './FlyingCartButton';

const Featured = ({ product }) => {
  return (
    <div className="bg-primaryDark pt-24 md:pt-0">
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-featured gap-10 text-center">
          <div className="relative p-48">
            {/* NEED TO FIX */}
            <Image
              src={product.images[0]}
              alt="Product image"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <RevealWrapper origin="right">
            <div className="pb-24 md:py-48">
              <h1 className="font-semibold text-white text-4xl">
                {product.title}
              </h1>

              <p className="text-primaryGray my-6">{product.description}</p>

              <div className="flex gap-4 items-center justify-center">
                <Link
                  href={{
                    pathname: '/product/[id]',
                    query: { id: product._id },
                  }}
                  className="border-white border p-2 rounded-md text-white"
                >
                  Read More
                </Link>
                <div>
                  <FlyingCartButton
                    src={product.images[0]}
                    productId={product._id}
                    text="Add to Cart"
                  />
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </Center>
    </div>
  );
};

export default Featured;
