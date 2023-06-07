import React, { useContext, useEffect, useRef } from 'react';
import { CartContext } from './CartContext';
import CartIcon from './icons/CartIcon';

const FlyingCartButton = ({ src, text = '', productId }) => {
  const { addProductToCart } = useContext(CartContext);
  const imageRef = useRef();
  const sendImageToCart = (e) => {
    imageRef.current.style.display = 'inline-block';
    imageRef.current.style.left = e.clientX + 'px';
    imageRef.current.style.top = e.clientY + 'px';
    imageRef.current.style.zIndex = '10';
    setTimeout(() => {
      if (imageRef) imageRef.current.style.display = 'none';
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imageRef?.current?.closest('div[data-sr-id]');
      if (reveal?.style.opacity === '1') {
        //visible
        reveal.style.transform = 'none';
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <button onClick={(e) => sendImageToCart(e)}>
        <img
          src={src}
          alt="Product Image"
          className="max-h-[50px] max-w-[50px] fixed hidden rounded-lg animate-fly"
          ref={imageRef}
        />
        <div
          className={`p-2 rounded-md flex bg-secondary`}
          onClick={() => addProductToCart(productId)}
        >
          <CartIcon />
          {text && 'Add to Cart'}
        </div>
      </button>
    </>
  );
};

export default FlyingCartButton;
