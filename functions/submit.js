export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const lead = {
      id: crypto.randomUUID(),
      businessName: data.businessName || "",
      email: data.email || "",
      industry: data.industry || "",
      createdAt: new Date().toISOString()
    };

    // 1. READ EXISTING DATA (simple file system approach for now)
    let leads = [];
    try {
      const file = await context.env.LEADS.get("leads");
      if (file) leads = JSON.parse(file);
    } catch (e) {
      leads = [];
    }

    // 2. ADD NEW LEAD
    leads.push(lead);

    // 3. SAVE BACK
    await context.env.LEADS.put("leads", JSON.stringify(leads));

    return new Response(JSON.stringify({
      success: true,
      leadId: lead.id
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), { status: 500 });
  }
}
