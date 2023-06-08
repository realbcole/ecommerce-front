import { mongooseConnect } from '@/lib/mongoose';
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from 'micro';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, { paid: true });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('ok');
}

export const config = {
  api: { bodyParser: false },
};
