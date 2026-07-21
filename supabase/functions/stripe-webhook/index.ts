import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2022-11-15",
});

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  try {
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (
      event.type === "invoice.payment_failed" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;

      if (
        subscription.status === "past_due" ||
        subscription.status === "unpaid"
      ) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .update({ billing_status: "past_due" })
          .eq("stripe_customer_id", subscription.customer)
          .select("site_id")
          .single();

        if (subData) {
          await supabase
            .from("client_sites")
            .update({ deployment_status: "suspended" })
            .eq("id", subData.site_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
