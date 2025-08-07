import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe instance
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Pricing plans configuration
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    priceId: null, // Free plan doesn't need a Stripe price ID
    features: [
      '100MB storage',
      '1 screen connection',
      'Basic file formats',
      'Email support'
    ],
    storage: 100 * 1024 * 1024, // 100MB in bytes
    maxScreens: 1
  },
  pro: {
    name: 'Pro',
    price: 9,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      '1GB storage',
      'Up to 10 screens',
      'All file formats',
      'Offline downloads',
      'Priority support'
    ],
    storage: 1024 * 1024 * 1024, // 1GB in bytes
    maxScreens: 10
  },
  business: {
    name: 'Business',
    price: 29,
    priceId: 'price_business_monthly', // Replace with actual Stripe price ID
    features: [
      '5GB storage',
      'Unlimited screens',
      'Team management',
      'Analytics & reporting',
      '24/7 phone support'
    ],
    storage: 5 * 1024 * 1024 * 1024, // 5GB in bytes
    maxScreens: -1 // -1 means unlimited
  }
};

export type PlanType = keyof typeof PRICING_PLANS;
