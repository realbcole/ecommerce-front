import { buffer } from 'micro';
import { mongooseConnect } from '../../lib/mongoose';
import { Order } from '../../models/Order';
import { NextApiHandler } from 'next';
import Stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SK);

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Stripe webhook signature
  const sig: string | string[] = req.headers['stripe-signature'];

  // Stripe endpoint secret
  const endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // Verify webhook signature and extract the event.
  try {
    const bodyBuffer: Buffer = await buffer(req);
    const body: string = bodyBuffer.toString();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  // Updates orders to paid when paid
  switch (event.type) {
    case 'checkout.session.completed':
      const data: { metadata?: { orderId: string } } = event.data.object;
      const orderId: string = data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, { paid: true });
      break;
    default:
  }

  res.status(200).send('ok');
};

// Disable body parser to access raw body
export const config = {
  api: { bodyParser: false },
};

export default handler;
