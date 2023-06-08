import { mongooseConnect } from '@/lib/mongoose';
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from 'micro';
import { Order } from '@/models/Order';

const endpointSecret = 'whsec_bvHVpW9CSPXyIB6NYHm2YeuceCvOCsha';

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
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
// solid-exult-favor-evenly
// acct_1NF6gRLfJoMbsKFU
//  Your webhook signing secret is whsec_fc2c0594da7368886580467f0c714cba10c05a5403f0d28f1c3fe15bc91b2aaf
