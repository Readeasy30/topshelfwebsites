// TopShelfWebsites Automation Orchestrator
// Cloudflare Pages Function
// Production Phase 2 command control layer

let pendingCommands = [];
let agentStatus = {
  status: "WORKING",
  lastHeartbeat: null
};

const allowedActions = [
  "build_site",
  "deploy_site",
  "seo_check",
  "health_check",
  "backup_repo"
];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://topshelfwebsites.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (url.pathname.endsWith("/orchestrate") && request.method === "POST") {
    try {
      const payload = await request.json();

      if (!allowedActions.includes(payload.action)) {
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const command = {
        id: crypto.randomUUID(),
        action: payload.action,
        payload: payload.payload || {},
        created: new Date().toISOString(),
        status: "QUEUED"
      };

      pendingCommands.push(command);

      if (pendingCommands.length > 20) {
        pendingCommands.shift();
      }

      return new Response(JSON.stringify(command), {
        status: 202,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch {
      return new Response(JSON.stringify({ error: "Malformed payload" }), {
        status: 400,
        headers: corsHeaders
      });
    }
  }

  if (url.pathname.endsWith("/agent-pull") && request.method === "GET") {
    const token = request.headers.get("X-Auth-Token");

    if (!token || token !== env.SECRET_AGENT_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const jobs = [...pendingCommands];
    pendingCommands = [];

    return new Response(JSON.stringify({
      status: "WORKING",
      jobs
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (url.pathname.endsWith("/heartbeat") && request.method === "POST") {
    agentStatus = {
      status: "WORKING",
      lastHeartbeat: new Date().toISOString()
    };

    return new Response(JSON.stringify(agentStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (url.pathname.endsWith("/status") && request.method === "GET") {
    return new Response(JSON.stringify(agentStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response("TopShelfWebsites Automation Node WORKING", {
    headers: corsHeaders
  });
}
