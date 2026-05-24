import Stripe from "stripe";

import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError(503, "STRIPE_UNAVAILABLE", "Paiement indisponible");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

export class PaymentsService {
  async createPaymentIntent(amount: number, currency = "mad"): Promise<{ clientSecret: string }> {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });
    if (!intent.client_secret) {
      throw new AppError(500, "STRIPE_ERROR", "Échec de création du paiement");
    }
    return { clientSecret: intent.client_secret };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError(503, "STRIPE_UNAVAILABLE", "Webhook non configuré");
    }
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    // TODO: persist payment status via Prisma
    void event;
  }
}

export const paymentsService = new PaymentsService();
