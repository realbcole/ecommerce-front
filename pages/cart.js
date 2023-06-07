import AccountInput from '@/components/AccountInput';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { RevealWrapper } from 'next-reveal';
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
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
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

  if (showSuccess) {
    return (
      <>
        <Header />
        <Center>
          <h1 className="mt-24">Thanks for your order!</h1>
          <p>We sent you an email confirmation.</p>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-cart gap-8 mt-24">
          <RevealWrapper delay={50}>
            <div className="bg-primaryGray rounded-lg p-8">
              {!products?.length ? (
                <div>Your cart is empty</div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">Cart</h2>
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
                        <tr key={product._id}>
                          <td className="w-[120px] h-[120px] flex flex-col justify-center">
                            <div className="p-1 mr-auto md:p-4 border border-black rounded-lg shadow-lg flex text-center bg-white">
                              <img
                                src={product.images[0]}
                                alt="Product Image"
                                className="max-h-[80px] max-w-[80px]"
                              />
                            </div>
                            {product.title}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                decreaseQuantityOfProduct(product._id)
                              }
                              className="bg-white rounded-md p-2"
                            >
                              -
                            </button>
                            <span className="mx-1">
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </span>
                            <button
                              onClick={() =>
                                increaseQuantityOfProduct(product._id)
                              }
                              className="bg-white rounded-md p-2"
                            >
                              +
                            </button>
                          </td>
                          <td>
                            $
                            {product.price *
                              cartProducts.filter((id) => id === product._id)
                                .length}
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
                        <td colSpan={2}>Total</td>
                        <td>${subTotal + parseInt(shippingFee || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </RevealWrapper>
          <RevealWrapper origin={'right'} delay={50}>
            {products?.length > 0 && (
              <div className="bg-primaryGray rounded-lg p-8">
                <h2>Order Information</h2>
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
                      className="bg-secondary py-1 px-2 rounded-lg w-full "
                    >
                      Continue to payment
                    </button>
                  </div>
                )}
              </div>
            )}
          </RevealWrapper>
        </div>
      </Center>
    </>
  );
};

export default CartPage;
