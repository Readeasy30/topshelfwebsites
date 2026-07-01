export async function onRequestPost(context) {
  const data = await context.request.json();

  // TEMP PLACEHOLDER (we will activate Stripe tomorrow)
  return new Response(JSON.stringify({
    url: "https://checkout.stripe.com/pay/cs_test_placeholder"
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
