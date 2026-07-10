export async function onRequestPost(context) {

  try {

    const request = await context.request.json();

    const businessName = request.businessName || "";
    const email = request.email || "";
    const industry = request.industry || "";


    /*
      Stripe connection point.

      Required environment variable:
      STRIPE_SECRET_KEY

      This keeps Cloudflare Pages Functions ready
      for Stripe checkout.
    */


    if (!context.env.STRIPE_SECRET_KEY) {

      return new Response(
        JSON.stringify({
          error: "Stripe key not configured",
          message: "Checkout setup pending"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }


    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {

        method: "POST",

        headers: {

          "Authorization":
          `Bearer ${context.env.STRIPE_SECRET_KEY}`,

          "Content-Type":
          "application/x-www-form-urlencoded"

        },


        body:
        new URLSearchParams({

          "mode":
          "payment",

          "success_url":
          "https://topshelfwebsites.com/success.html",

          "cancel_url":
          "https://topshelfwebsites.com/",

          "customer_email":
          email,

          "line_items[0][price_data][currency]":
          "usd",

          "line_items[0][price_data][product_data][name]":
          "Top Shelf Websites - Setup",

          "line_items[0][price_data][unit_amount]":
          "19900",

          "line_items[0][quantity]":
          "1"

        })

      });


    const session =
    await stripeResponse.json();


    return new Response(

      JSON.stringify({

        url: session.url,

        businessName,

        industry

      }),

      {

        status:200,

        headers:{
          "Content-Type":"application/json"
        }

      }

    );


  }

  catch(error){


    return new Response(

      JSON.stringify({

        error:
        error.message

      }),

      {

        status:500,

        headers:{
          "Content-Type":"application/json"
        }

      }

    );


  }

}
