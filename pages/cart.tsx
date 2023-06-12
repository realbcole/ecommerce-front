import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { RevealWrapper } from 'next-reveal';
import Image from 'next/image';
import Link from 'next/link';
import AccountInput from '../components/AccountInput';
import { CartContext } from '../components/CartContext';
import Center from '../components/Center';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import MinusIcon from '../components/icons/MinusIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { ProductType, SettingsType } from '../types';
import { Settings } from '../models/Settings';
import { mongooseConnect } from '../lib/mongoose';

// Cart page component
const CartPage: React.FC<{ shopName: string }> = ({ shopName }) => {
  const { cartProducts, addProductToCart, removeProductFromCart, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showCancel, setShowCancel] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [orderInfoFilled, setOrderInfoFilled] = useState<boolean>(false);

  // On start, get account details and shipping fee
  useEffect(() => {
    if (window.location.href.includes('success')) {
      clearCart();
      setShowSuccess(true);
    } else if (window.location.href.includes('canceled')) {
      setShowCancel(true);
    } else {
      setShowSuccess(false);
      setLoadingDetails(true);
      axios.get('/api/account').then((response) => {
        setName(response.data?.name || '');
        setEmail(response.data?.email || '');
        setStreetAddress(response.data?.streetAddress || '');
        setCity(response.data?.city || '');
        setState(response.data?.state || '');
        setCountry(response.data?.country || '');
        setZipCode(response.data?.zipCode || '');
        setLoadingDetails(false);
      });

      axios.get('/api/settings?name=shippingFee').then((response) => {
        setShippingFee(response?.data?.value);
      });
      allFieldsFilled() ? setOrderInfoFilled(true) : setOrderInfoFilled(false);
    }
  }, []);

  // On cart products change, get products in cart
  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
        setLoadingCart(false);
      });
    } else {
      setProducts([]);
      setLoadingCart(false);
    }
  }, [cartProducts]);

  // On order info change, check if all fields are filled
  useEffect(() => {
    allFieldsFilled() ? setOrderInfoFilled(true) : setOrderInfoFilled(false);
  }, [name, email, streetAddress, city, state, country, zipCode]);

  // Increase quantity of product
  function increaseQuantityOfProduct(productId: string) {
    addProductToCart(productId);
  }

  // Decrease quantity of product
  function decreaseQuantityOfProduct(productId: string) {
    removeProductFromCart(productId);
  }

  // Handle quantity change
  function handleQuantityChange(value: string, productId: string) {
    let newValue: number;
    if (value === '') newValue = 1;
    newValue = parseInt(value);
    const currentQuantity = cartProducts.filter(
      (id) => id === productId
    ).length;
    if (newValue > currentQuantity) {
      const difference: number = newValue - currentQuantity;
      for (let i = 0; i < difference; i++) {
        addProductToCart(productId);
      }
    } else if (newValue < currentQuantity) {
      const difference: number = currentQuantity - newValue;
      for (let i = 0; i < difference; i++) {
        removeProductFromCart(productId);
      }
    }
  }

  // Go to payment
  async function goToPayment() {
    if (!allFieldsFilled()) {
      setOrderInfoFilled(false);
      return;
    }
    const response = await axios.post('/api/checkout', {
      name,
      email,
      streetAddress,
      city,
      state,
      country,
      zipCode,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  // Check if all fields are filled
  function allFieldsFilled() {
    try {
      return (
        name.length > 0 &&
        email.length > 0 &&
        streetAddress.length > 0 &&
        city.length > 0 &&
        state.length > 0 &&
        country.length > 0 &&
        zipCode.length > 0
      );
    } catch (err) {
      return false;
    }
  }

  // Calculate subtotal
  let subTotal: number = 0;
  for (const productId of cartProducts) {
    const price =
      products.find((product) => product._id === productId)?.price || 0;
    subTotal += price;
  }

  return (
    <>
      <Header shopName={shopName} />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          {/* Success Message */}
          {showSuccess && (
            <>
              <div className="bg-primaryDark p-8 rounded-md mt-24 shadow-lg">
                <h1 className="text-secondaryBg text-3xl font-semibold">
                  Thanks for your order!
                </h1>
                <p className="text-secondaryBg text-xl">
                  We sent you an email confirmation.
                </p>
              </div>
            </>
          )}

          {/* Cancel Message */}
          {showCancel && (
            <>
              <div className="bg-primaryDark p-8 rounded-md mt-24 shadow-lg">
                <h1 className="text-secondaryBg text-3xl font-semibold">
                  Something went wrong with your order.
                </h1>
                <p className="text-secondaryBg text-xl">Please try again.</p>
              </div>
            </>
          )}

          {/* Cart and Order Information */}
          {!showSuccess && !showCancel && (
            <div className="grid grid-cols-1 md:grid-cols-cart gap-8 mt-24">
              {loadingCart ? (
                <Spinner className="mt-32" />
              ) : (
                <RevealWrapper delay={20}>
                  <div className="rounded-lg p-8 bg-primaryDark">
                    {/* Cart Card */}
                    {products?.length <= 0 ? (
                      <h1 className="text-secondaryBg text-3xl font-semibold">
                        No items in cart
                      </h1>
                    ) : (
                      <>
                        <h2 className="text-3xl text-secondaryBg">Cart</h2>
                        <table className="text-left uppercase text-sm w-full">
                          <thead>
                            <tr className="text-secondaryBg">
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody className="text-secondaryBg">
                            {/* Cart products */}
                            {products?.map((product) => (
                              <tr
                                key={product._id}
                                className="border-b border-secondaryBg"
                              >
                                <td className="flex flex-col justify-center">
                                  <div className="flex items-center flex-wrap py-4">
                                    {/* Product Image */}
                                    <Link
                                      className={`w-[60px] h-[60px] md:w-[120px] md:h-[120px] bg-secondaryBg rounded-md flex justify-center items-center`}
                                      href={`/product/${product._id}`}
                                    >
                                      <div className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px]">
                                        <Image
                                          src={product.images[0]}
                                          alt="Product Image"
                                          fill
                                          style={{
                                            objectFit: 'contain',
                                          }}
                                          sizes="100px"
                                        />
                                      </div>
                                    </Link>
                                    <Link
                                      className="text-sm md:text-xl lg:m-2"
                                      href={`/product/${product._id}`}
                                    >
                                      {product.title}
                                    </Link>
                                  </div>
                                </td>
                                <td>
                                  {/* Quantity */}
                                  <div className="flex items-center mr-4">
                                    <button
                                      onClick={() =>
                                        decreaseQuantityOfProduct(product._id)
                                      }
                                      className="bg-secondaryBg p-1 md:p-2 rounded-l-md text-primaryDark"
                                    >
                                      <MinusIcon />
                                    </button>
                                    <input
                                      className="bg-secondaryBg p-1 md:p-2 w-[20px] md:w-[40px] text-center text-primaryDark rounded-none"
                                      type="text"
                                      value={
                                        cartProducts.filter(
                                          (id) => id === product._id
                                        ).length
                                      }
                                      onChange={(e) => {
                                        handleQuantityChange(
                                          e.target.value,
                                          product._id
                                        );
                                      }}
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        increaseQuantityOfProduct(product._id);
                                      }}
                                      className="bg-secondaryBg p-1 md:p-2 rounded-r-md text-primaryDark"
                                    >
                                      <PlusIcon />
                                    </button>
                                  </div>
                                </td>
                                {/* Price */}
                                <td className="text-lg font-bold">
                                  $
                                  {product.price *
                                    cartProducts.filter(
                                      (id) => id === product._id
                                    ).length}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={2}>Subtotal</td>
                              <td>${subTotal}</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>Shipping</td>
                              <td>${shippingFee}</td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="font-bold text-xl">
                                Total
                              </td>
                              <td className="font-bold text-xl">
                                ${subTotal + (shippingFee || 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </RevealWrapper>
              )}

              {/* Order Information Card */}
              <RevealWrapper origin={'right'} delay={20}>
                {products?.length > 0 && (
                  <div className="bg-primaryDark rounded-lg p-8">
                    <h2 className="text-secondaryBg text-3xl mb-4">
                      Order Information
                    </h2>
                    {loadingDetails ? (
                      <Spinner className="mt-8" />
                    ) : (
                      <div>
                        <AccountInput
                          type="text"
                          placeholder="*Name"
                          value={name}
                          name="name"
                          onChange={(e) => setName(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*Email"
                          value={email}
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*Street Address"
                          value={streetAddress}
                          name="streetAddress"
                          onChange={(e) => setStreetAddress(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*City"
                          value={city}
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*State"
                          value={state}
                          name="state"
                          onChange={(e) => setState(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*Country"
                          value={country}
                          name="country"
                          onChange={(e) => setCountry(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="*Zip Code"
                          value={zipCode}
                          name="zipCode"
                          onChange={(e) => setZipCode(e.target.value)}
                        ></AccountInput>
                        {!orderInfoFilled && (
                          <p className="text-secondary text-sm">
                            *Missing required fields.
                          </p>
                        )}
                        <button
                          onClick={goToPayment}
                          className="bg-secondary py-1 px-2 rounded-lg w-full text-secondaryBg mt-2"
                        >
                          Continue to payment
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </RevealWrapper>
            </div>
          )}
        </Center>
      </div>
    </>
  );
};

export default CartPage;

// Fetch categories and wishlist before rendering page
export async function getServerSideProps() {
  await mongooseConnect();

  const shopName: SettingsType = await Settings.findOne({ name: 'shopName' });
  return {
    props: {
      shopName: JSON.parse(JSON.stringify(shopName?.value)),
    },
  };
}
