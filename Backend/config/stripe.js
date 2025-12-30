import dotenv from "dotenv";
import stripe from "stripe";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY missing");
}

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export default stripeInstance;
