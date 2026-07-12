const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET);

const createPaymentIntent = async (amount) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
  });
};

module.exports = { createPaymentIntent };