import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import FlyingCartButton from './FlyingCartButton';
import HeartOutlineIcon from './icons/HeartOutlineIcon';
import HeartIcon from './icons/HeartIcon';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ProductBox = ({
  product,
  inWishlist,
  onRemove = () => {},
  wishlist = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(inWishlist);
  const { data: session } = useSession();

  function addToWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    const nextValue = !isWishlisted;
    if (nextValue === false && onRemove) onRemove(product._id);
    axios
      .post('/api/wishlist', {
        product: product._id,
      })
      .then(() => {});
    setIsWishlisted(nextValue);
  }

  return (
    <div
      className={`flex flex-col relative ${
        wishlist ? 'w-[175px] h-[250px]' : 'w-[275px] h-[350px]'
      }`}
    >
      {session && (
        <button
          onClick={addToWishlist}
          className={`absolute top-0 left-0 p-4 z-10 bg-transparent`}
        >
          {isWishlisted ? (
            <HeartIcon className="text-secondary" />
          ) : (
            <HeartOutlineIcon className="text-secondary" />
          )}
        </button>
      )}

      <Link
        className={`shadow-lg p-8 rounded-lg cursor-pointer bg-secondaryBg flex justify-center`}
        href={{
          pathname: '/product/[id]',
          query: { id: product._id },
        }}
      >
        <div
          className={`relative flex justify-center items-center ${
            wishlist ? 'w-[100px] h-[100px]' : 'w-[200px] h-[200px]'
          }`}
        >
          <Image
            src={product.images[0]}
            alt="Product Image"
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      </Link>
      <div className="mt-4">
        <h1
          className={`font-extrabold  mb-1 ${
            wishlist ? 'text-sm text-secondaryBg' : 'text-xl text-primaryDark'
          }`}
        >
          {product?.title}
        </h1>
        <div className="flex justify-between items-center gap-4">
          <h2
            className={`${
              wishlist ? 'text-md text-secondaryBg' : 'text-xl text-primaryDark'
            }`}
          >
            ${product?.price}
          </h2>
          {wishlist ? (
            <FlyingCartButton
              src={product.images[0]}
              productId={product?._id}
              smaller
            />
          ) : (
            <FlyingCartButton
              src={product.images[0]}
              productId={product?._id}
              text
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
