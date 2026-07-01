export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const lead = {
      id: crypto.randomUUID(),
      businessName: data.businessName,
      email: data.email,
      industry: data.industry,
      createdAt: new Date().toISOString()
    };

    // LOAD DATABASE
    let leads = await context.env.LEADS.get("leads");
    leads = leads ? JSON.parse(leads) : [];

    // ADD NEW LEAD
    leads.push(lead);

    // SAVE DATABASE
    await context.env.LEADS.put("leads", JSON.stringify(leads));

    return new Response(JSON.stringify({
      success: true,
      lead
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500 });
  }
}
