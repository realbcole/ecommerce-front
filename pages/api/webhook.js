import { buffer } from 'micro';
import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  // Connect to database
  await mongooseConnect();

  // Stripe webhook signature
  const sig = req.headers['stripe-signature'];

  // Stripe endpoint secret
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  // Verify webhook signature and extract the event.
  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  // Updates orders to paid when paid
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, { paid: true });
      break;
    default:
  }

  res.status(200).send('ok');
}

// Disable body parser to access raw body
export const config = {
  api: { bodyParser: false },
};
