import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { Settings } from '@/models/Settings';
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  // If not a POST request, return
  if (req.method !== 'POST') {
    res.json('Should be a POST request');
    return;
  }

  // Connect to database
  await mongooseConnect();

  // Get data from request body
  const {
    name,
    email,
    streetAddress,
    city,
    state,
    country,
    zipCode,
    cartProducts,
  } = req.body;

  // Fetch products in cart
  const productIds = cartProducts;
  const uniqueIds = [...new Set(productIds)];
  const productInfos = await Product.find({ _id: uniqueIds });

  // Create line items for stripe
  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        price: productInfo.stripePriceId,
        price_data: {
          currency: 'usd',
          product: productInfo._id.toString(),
          unit_amount: productInfo.price * 100,
        },
        quantity,
      });
    }
  }

  // Get session
  const session = await getServerSession(req, res, authOptions);

  // Create order
  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    streetAddress,
    city,
    state,
    country,
    zipCode,
    paid: false,
    userEmail: session?.user?.email,
  });

  // Fetch shipping fee
  const shippingFeeSetting = await Settings.findOne({ name: 'shippingFee' });
  const shippingFee = parseInt(shippingFeeSetting?.value || 0) * 100;

  // Create stripe session
  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    success_url: `${process.env.URL}/cart?success=true`,
    cancel_url: `${process.env.URL}/cart?canceled=true`,
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Shipping Fee',
          type: 'fixed_amount',
          fixed_amount: { amount: shippingFee, currency: 'USD' },
        },
      },
    ],
  });

  // Return stripe session url
  res.json({ url: stripeSession.url });
}
