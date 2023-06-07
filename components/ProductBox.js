import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import FlyingCartButton from './FlyingCartButton';
import HeartOutlineIcon from './icons/HeartOutlineIcon';
import HeartIcon from './icons/HeartIcon';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ProductBox = ({ product, inWishlist, onRemove = () => {} }) => {
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
    <div className="flex flex-col relative">
      {session && (
        <button
          onClick={addToWishlist}
          className={`absolute top-0 right-0 p-4 z-10 bg-transparent`}
        >
          {isWishlisted ? (
            <HeartIcon className="text-primaryDark" />
          ) : (
            <HeartOutlineIcon className="text-primaryDark" />
          )}
        </button>
      )}

      <Link
        className="bg-primaryGray p-8 rounded-lg cursor-pointer block"
        href={{
          pathname: '/product/[id]',
          query: { id: product._id },
        }}
      >
        <div className="relative p-16">
          <Image
            src={
              product.images[0] ||
              'https://bcole-next-ecommerce.s3.amazonaws.com/1685562550945.png'
            }
            alt="Product Image"
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
        <h1 className="text-center">{product?.title}</h1>
      </Link>
      <div className="flex justify-between items-center gap-4 mt-4">
        <h2 className="text-2xl font-bold">${product?.price}</h2>
        <FlyingCartButton src={product.images[0]} productId={product?._id} />
      </div>
    </div>
  );
};

export default ProductBox;
