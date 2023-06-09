import AccountInput from '@/components/AccountInput';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import MinusIcon from '@/components/icons/MinusIcon';
import PlusIcon from '@/components/icons/PlusIcon';
import axios from 'axios';
import { RevealWrapper } from 'next-reveal';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

const CartPage = () => {
  const { cartProducts, addProductToCart, removeProductFromCart, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
        setLoadingCart(false);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (window.location.href.includes('success')) {
      clearCart();
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
      setLoadingDetails(true);
      axios.get('/api/account').then((response) => {
        setName(response.data?.name);
        setEmail(response.data?.email);
        setStreetAddress(response.data?.streetAddress);
        setCity(response.data?.city);
        setState(response.data?.state);
        setCountry(response.data?.country);
        setZipCode(response.data?.zipCode);
        setLoadingDetails(false);
      });
      axios.get('/api/settings?name=shippingFee').then((response) => {
        setShippingFee(response?.data?.value);
      });
    }
  }, []);

  const increaseQuantityOfProduct = (productId) => {
    addProductToCart(productId);
  };

  const decreaseQuantityOfProduct = (productId) => {
    removeProductFromCart(productId);
  };

  const goToPayment = async () => {
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
  };

  let subTotal = 0;
  for (const productId of cartProducts) {
    const price =
      products.find((product) => product._id === productId)?.price || 0;
    subTotal += price;
  }

  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          {showSuccess ? (
            <>
              <div className="bg-secondaryBg p-8 rounded-md mt-24 shadow-lg">
                <h1 className="text-primaryDark text-3xl font-semibold">
                  Thanks for your order!
                </h1>
                <p className="text-primaryDark text-xl">
                  We sent you an email confirmation.
                </p>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-cart gap-8 mt-24">
              <RevealWrapper delay={50}>
                {loadingCart ? (
                  <div className="flex justify-center items-center mt-32">
                    <Spinner />
                  </div>
                ) : (
                  <div className="rounded-lg p-8 bg-secondaryBg">
                    {!products?.length ? (
                      <div>Your cart is empty</div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-semibold text-primaryDark">
                          Cart
                        </h2>
                        <table className="text-left uppercase text-sm w-full">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products?.map((product) => (
                              <tr
                                key={product._id}
                                className="border-b border-primaryDark"
                              >
                                <td className="flex flex-col justify-center">
                                  <div className="flex items-center flex-wrap">
                                    <Link
                                      className={`relative w-[150px] h-[150px]`}
                                      href={`/product/${product._id}`}
                                    >
                                      <Image
                                        src={product.images[0]}
                                        alt="Product Image"
                                        fill
                                        style={{
                                          objectFit: 'contain',
                                        }}
                                      />
                                    </Link>
                                    <Link
                                      className="font-xl font-bold m-2"
                                      href={`/product/${product._id}`}
                                    >
                                      {product.title}
                                    </Link>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        decreaseQuantityOfProduct(product._id)
                                      }
                                      className="bg-extraDetails p-2 rounded-l-md"
                                    >
                                      <MinusIcon />
                                    </button>
                                    <span className="bg-extraDetails p-2">
                                      {
                                        cartProducts.filter(
                                          (id) => id === product._id
                                        ).length
                                      }
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        increaseQuantityOfProduct(product._id);
                                      }}
                                      className="bg-extraDetails p-2 rounded-r-md"
                                    >
                                      <PlusIcon />
                                    </button>
                                  </div>
                                </td>
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
                                ${subTotal + parseInt(shippingFee || 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                )}
              </RevealWrapper>
              <RevealWrapper origin={'right'} delay={50}>
                {products?.length > 0 && (
                  <div className="bg-secondaryBg rounded-lg p-8">
                    <h2 className="text-primaryDark text-2xl font-semibold mb-4">
                      Order Information
                    </h2>
                    {loadingDetails ? (
                      <div className="flex items-center justify-center my-8">
                        <Spinner />
                      </div>
                    ) : (
                      <div>
                        <AccountInput
                          type="text"
                          placeholder="Name"
                          value={name}
                          name="name"
                          onChange={(e) => setName(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="Email"
                          value={email}
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="Street Address"
                          value={streetAddress}
                          name="streetAddress"
                          onChange={(e) => setStreetAddress(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="City"
                          value={city}
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="State"
                          value={state}
                          name="state"
                          onChange={(e) => setState(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="Country"
                          value={country}
                          name="country"
                          onChange={(e) => setCountry(e.target.value)}
                        ></AccountInput>
                        <AccountInput
                          type="text"
                          placeholder="Zip Code"
                          value={zipCode}
                          name="zipCode"
                          onChange={(e) => setZipCode(e.target.value)}
                        ></AccountInput>
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
