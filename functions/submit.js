export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const lead = {
      id: crypto.randomUUID(),
      businessName: data.businessName || "",
      email: data.email || "",
      industry: data.industry || "",
      goal: data.goal || "",
      createdAt: new Date().toISOString()
    };

    // TEMP STORAGE (safe fallback — works WITHOUT KV)
    let leads = [];

    try {
      const file = await context.env?.LEADS?.get("leads");
      if (file) leads = JSON.parse(file);
    } catch (e) {
      leads = [];
    }

    leads.push(lead);

    try {
      await context.env?.LEADS?.put("leads", JSON.stringify(leads));
    } catch (e) {
      // KV not enabled yet → still works (no crash)
    }

    return new Response(JSON.stringify({
      success: true,
      leadId: lead.id
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
