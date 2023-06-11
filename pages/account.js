import React, { useState } from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { RevealWrapper } from 'next-reveal';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { AccountDetails } from '@/models/AccountDetails';
import { Order } from '@/models/Order';
import { WishlistProduct } from '@/models/WishlistProduct';
import { Product } from '@/models/Product';
import AccountInput from '@/components/AccountInput';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductBox from '@/components/ProductBox';
import Tabs from '@/components/Tabs';

// Order details component
// Used to display order details on the account page
const OrderDetails = ({ order }) => {
  return (
    <div className="p-2 my-2 text-secondaryBg border-b-2 border-secondaryBg">
      {/* Order date */}
      <time className="text-xl md:text-2xl">
        {new Date(order.createdAt).toLocaleString()}
      </time>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <p>{order.name}</p>
          <p>{order.email}</p>
          <p>{order.streetAddress}</p>
          <p>
            {order.city}, {order.state} {order.zipCode}
          </p>
          <p>{order.country}</p>
          <p className={`${order.paid ? 'text-green-500' : 'text-red-500'}`}>
            {order.paid ? 'Paid' : 'Not Paid'}
          </p>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            {order.line_items.map((item) => (
              <div key={item.price_data.product_data.name}>
                <p>
                  <span className="text-secondaryBg/75">
                    {item.quantity} x{' '}
                  </span>
                  {item.price_data.product_data.name}
                </p>
              </div>
            ))}
          </div>
          <p>TOTAL: ${order.line_items[0].subTotal}</p>
        </div>
      </div>
    </div>
  );
};

// Account page component
const AccountPage = ({ orderData, accountDetails, wishlistData }) => {
  const [name, setName] = useState(accountDetails.name);
  const [email, setEmail] = useState(accountDetails.email);
  const [streetAddress, setStreetAddress] = useState(
    accountDetails.streetAddress
  );
  const [city, setCity] = useState(accountDetails.city);
  const [state, setState] = useState(accountDetails.state);
  const [country, setCountry] = useState(accountDetails.country);
  const [zipCode, setZipCode] = useState(accountDetails.zipCode);
  const [wishlist, setWishlist] = useState(
    wishlistData.map((product) => product.product)
  );
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState(orderData || []);

  const { data: session } = useSession();

  // Handle logout
  async function handleLogout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  // Handle login
  async function handleLogin() {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  // Save account details
  async function SaveAccountDetails() {
    const data = { name, email, streetAddress, city, state, country, zipCode };
    await axios.put('/api/account', data);
  }

  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <div className="grid grid-cols-1 lg:grid-cols-cart gap-8 mt-24">
            {/* Orders/Wishlist Card */}
            <RevealWrapper className="-order-first lg:-order-last">
              <div className="bg-primaryDark rounded-lg min-h-[200px] items-center p-8 shadow-lg">
                <Tabs
                  tabs={['Orders', 'Wishlist']}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {/* Wishlist */}
                {activeTab === 'Wishlist' && (
                  <div className="p-4 mt-4">
                    {session ? (
                      <div>
                        {wishlist.length > 0 ? (
                          <>
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex flex-wrap justify-center gap-4">
                                {wishlist.map((product, index) => (
                                  <div key={index}>
                                    {product?._id && (
                                      <ProductBox
                                        wishlist
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
                {/* Orders */}
                {activeTab === 'Orders' && (
                  <div className="mt-4">
                    {session ? (
                      <div>
                        <>
                          {orders.length > 0 ? (
                            <>
                              {orders.map((order) => (
                                <div key={order._id}>
                                  <OrderDetails order={order} />
                                </div>
                              ))}
                            </>
                          ) : (
                            <span>No orders found</span>
                          )}
                        </>
                      </div>
                    ) : (
                      <span>Log in to view your orders</span>
                    )}
                  </div>
                )}
              </div>
            </RevealWrapper>

            {/* Account Details Card */}
            <RevealWrapper origin="right">
              <div className="bg-primaryDark rounded-lg min-h-[200px] flex flex-col items-center p-8 shadow-lg">
                <h2 className="text-3xl text-secondaryBg">Account Details</h2>
                {session ? (
                  <div className="flex flex-col w-full">
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

// Fetch orders, account details, and wishlist
export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;
  const orders = await Order.find({ userEmail: user?.email }, null, {
    sort: { createdAt: -1 },
  });

  // Fetch product titles from order line items
  for (const order of orders) {
    const productIds = order.line_items.map((item) => item.price_data.product);
    const products = await Product.find({ _id: productIds });
    const productsMap = {};
    for (const product of products) {
      productsMap[product._id] = product;
    }

    let subTotal = 0;
    for (const line of order.line_items) {
      const price = line.price_data.unit_amount / 100;
      subTotal += price * line.quantity;
    }

    order.line_items = order.line_items.map((item) => {
      return {
        ...item,
        subTotal: subTotal,
        price_data: {
          ...item.price_data,
          product_data: {
            name: productsMap[item.price_data.product].title,
          },
        },
      };
    });
  }
  const accountDetails = await AccountDetails.findOne({ email: user?.email });

  const wishlist = await WishlistProduct.find({
    userEmail: user?.email,
  }).populate('product');

  return {
    props: {
      orderData: JSON.parse(JSON.stringify(orders)),
      accountDetails: JSON.parse(JSON.stringify(accountDetails)),
      wishlistData: JSON.parse(JSON.stringify(wishlist)),
    },
  };
}
