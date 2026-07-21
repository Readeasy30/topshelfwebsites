-- Add Stripe customer reference for automated billing webhooks

ALTER TABLE subscriptions
ADD COLUMN stripe_customer_id VARCHAR(255);

CREATE INDEX idx_subscriptions_stripe_customer_id
ON subscriptions(stripe_customer_id);
