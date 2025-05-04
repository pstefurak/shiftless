import { StripeProduct } from './stripe';

/**
 * Stripe product configuration
 * 
 * This file contains the configuration for all products available in the application.
 * Each product must include:
 * - id: The Stripe product ID
 * - priceId: The Stripe price ID
 * - name: The display name of the product
 * - description: A description of the product
 * - mode: The checkout mode ('payment' or 'subscription')
 */
export const products: StripeProduct[] = [
  {
    id: 'prod_S9Ot9DsFHd7YEu',
    priceId: 'price_1RF65iGa2SdsEhOHanaPspsK',
    name: 'ShiftLess Pro',
    description: 'Everything you need to manage orders efficiently. Includes unlimited orders, automated SMS notifications, and priority support.',
    mode: 'subscription',
  },
];