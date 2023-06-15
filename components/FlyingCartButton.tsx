import React, { useContext, useEffect, useRef } from 'react';
import { CartContext } from './CartContext';
import CartIcon from './icons/CartIcon';
import { FlyingCartButtonProps } from '../types';

// Flying cart button component
// Used to add product to cart and show animation
const FlyingCartButton: React.FC<FlyingCartButtonProps> = ({
  src,
  text = false,
  productId,
  smaller = false,
}) => {
  const { addProductToCart } = useContext(CartContext);
  const imageRef = useRef<HTMLImageElement>();

  // On image load, set image position to absolute
  useEffect(() => {
    const interval = setInterval(() => {
      const reveal: HTMLImageElement =
        imageRef?.current?.closest('div[data-sr-id]');
      if (reveal?.style.opacity === '1') {
        //visible
        reveal.style.transform = 'none';
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Send image to cart
  function sendImageToCart(e) {
    imageRef.current.style.display = 'inline-block';
    imageRef.current.style.left = e.clientX + 'px';
    imageRef.current.style.top = e.clientY + 'px';
    imageRef.current.style.zIndex = '10';
    setTimeout(() => {
      if (imageRef) imageRef.current.style.display = 'none';
    }, 500);
  }

  return (
    <>
      <button
        onClick={(e) => {
          sendImageToCart(e);
          addProductToCart(productId);
        }}
        className={`rounded-md flex py-1 px-2 text-secondaryBg bg-secondary`}
      >
        <img
          src={src}
          alt="Product Image"
          className="max-h-[50px] max-w-[50px] fixed hidden rounded-lg animate-fly"
          ref={imageRef}
        />
        <CartIcon className={`${smaller ? 'w-4 h-4' : 'w-6 h-6 mr-1'}`} />
        {text && <p className="text-lg">Add to Cart</p>}
      </button>
    </>
  );
};

export default FlyingCartButton;
