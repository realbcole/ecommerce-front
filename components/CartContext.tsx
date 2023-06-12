import React, { createContext, useEffect, useState } from 'react';
import { CartContextType, ProductType } from '../types';

// Create context
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Create context provider
const CartContextProvider = ({ children }) => {
  // Cart products
  const [cartProducts, setCartProducts] = useState<string[]>([]);

  // Local storage
  const ls = typeof window !== 'undefined' ? localStorage : null;

  // On start, get cart products from local storage
  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  // On cart products change, update local storage
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  // Add product to cart
  function addProductToCart(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  // Remove product from cart
  function removeProductFromCart(productId) {
    setCartProducts((prev) => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }

  // Clear cart
  function clearCart() {
    ls?.removeItem('cart');
    setCartProducts([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProductToCart,
        removeProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
