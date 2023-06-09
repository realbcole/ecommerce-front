import AccountInput from '@/components/AccountInput';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductBox from '@/components/ProductBox';
import ProductsFlex from '@/components/ProductsFlex';
import Spinner from '@/components/Spinner';
import Tabs from '@/components/Tabs';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { RevealWrapper } from 'next-reveal';
import React, { useEffect, useState } from 'react';

const Order = ({ order }) => {
  return (
    <div className="p-2 my-2 text-primaryDark bg-extraDetails rounded-md">
      <time className="text-xl font-semibold">
        {new Date(order.createdAt).toLocaleString()}
      </time>
      <div className="grid grid-cols-2">
        <div>
          <p>{order.name}</p>
          <p>{order.email}</p>
          <p>{order.streetAddress}</p>
          <p>
            {order.city}, {order.state} {order.zipCode}
          </p>
          <p>{order.country}</p>
          <p className={`${order.paid ? 'text-green-900' : 'text-red-900'}`}>
            {order.paid ? 'Paid' : 'Not Paid'}
          </p>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            {order.line_items.map((item) => (
              <div key={item.price_data.product_data.name}>
                <p className="font-semibold">
                  <span className="text-primaryDark/75">
                    {item.quantity} x{' '}
                  </span>
                  {item.price_data.product_data.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const { data: session } = useSession();

  async function handleLogout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function handleLogin() {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function SaveAccountDetails() {
    const data = { name, email, streetAddress, city, state, country, zipCode };
    await axios.put('/api/account', data);
  }

  useEffect(() => {
    setAccountLoading(true);
    axios.get('/api/account').then((response) => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setStreetAddress(response.data?.streetAddress);
      setCity(response.data?.city);
      setState(response.data?.state);
      setCountry(response.data?.country);
      setZipCode(response.data?.zipCode);
      setAccountLoading(false);
    });
    axios.get('/api/wishlist').then((response) => {
      setWishlist(response.data.map((product) => product.product));
      setWishlistLoading(false);
    });
    setOrdersLoading(true);
    axios.get('/api/orders').then((response) => {
      setOrders(response.data);
      setOrdersLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <div className="grid grid-cols-1 lg:grid-cols-cart gap-8 mt-24">
            <RevealWrapper delay={50} className="-order-first lg:-order-last">
              <div className="bg-secondaryBg rounded-lg min-h-[200px] items-center p-4 shadow-lg">
                <Tabs
                  tabs={['Orders', 'Wishlist']}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === 'Wishlist' && (
                  <div className="p-4 mt-4">
                    {session ? (
                      <div>
                        {wishlist.length > 0 ? (
                          <>
                            {wishlistLoading ? (
                              <div className="flex justify-center items-center">
                                <Spinner />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-wrap justify-center gap-4">
                                  {wishlist.map((product, index) => (
                                    <div key={index}>
                                      {product?._id && (
                                        <ProductBox
                                          smaller
                                          border
                                          product={product}
                                          inWishlist={true}
                                          onRemove={(productId) => {
                                            setWishlist((prev) => {
                                              return [
                                                ...prev.filter(
                                                  (product) =>
                                                    product?._id.toString() !==
                                                    productId.toString()
                                                ),
                                              ];
                                            });
                                          }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <span>Your wishlist is empty</span>
                        )}
                      </div>
                    ) : (
                      <span>Log in to add to your wishlist</span>
                    )}
                  </div>
                )}
                {activeTab === 'Orders' && (
                  <div className="p-4 mt-4">
                    {session ? (
                      <div>
                        {ordersLoading ? (
                          <div className="flex justify-center items-center">
                            <Spinner />
                          </div>
                        ) : (
                          <>
                            {orders.length > 0 ? (
                              <>
                                {orders.map((order) => (
                                  <div key={order._id}>
                                    <Order order={order} />
                                  </div>
                                ))}
                              </>
                            ) : (
                              <span>No orders found</span>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <span>Log in to view your orders</span>
                    )}
                  </div>
                )}
              </div>
            </RevealWrapper>

            <RevealWrapper delay={50} origin="right">
              <div className="bg-secondaryBg rounded-lg min-h-[200px] flex flex-col items-center p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-primaryDark">
                  Account Details
                </h2>
                {session ? (
                  <div className="flex flex-col w-full">
                    {accountLoading ? (
                      <div className="flex justify-center items-center my-4">
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
                          className="!mt-4"
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
                          onClick={SaveAccountDetails}
                          className="bg-secondary py-1 px-2 rounded-md w-full text-secondaryBg"
                        >
                          Save
                        </button>
                        <div className="my-4 border-b border-extraDetails" />
                      </div>
                    )}

                    <button
                      className="bg-secondary py-1 px-2 rounded-md text-secondaryBg"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-secondary py-1 px-2 rounded-md"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )}
              </div>
            </RevealWrapper>
          </div>
        </Center>
      </div>
    </>
  );
};

export default AccountPage;
