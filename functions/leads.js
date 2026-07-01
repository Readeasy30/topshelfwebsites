export async function onRequestGet(context) {
  let leads = await context.env.LEADS.get("leads");
  leads = leads ? JSON.parse(leads) : [];

  return new Response(JSON.stringify({ leads }), {
    headers: { "Content-Type": "application/json" }
  });
}
