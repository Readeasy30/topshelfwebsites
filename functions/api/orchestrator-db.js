// TopShelfWebsites D1 Persistent Automation Orchestrator

const allowedActions = [
  "build_site",
  "deploy_site",
  "seo_check",
  "health_check",
  "backup_repo"
];

export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname.endsWith("/orchestrate")) {
    const payload = await request.json();

    if (!allowedActions.includes(payload.action)) {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO commands
      (id, action, payload, status, created_at)
      VALUES (?, ?, ?, ?, ?)`
    ).bind(
      id,
      payload.action,
      JSON.stringify(payload.payload || {}),
      "QUEUED",
      new Date().toISOString()
    ).run();

    return Response.json({
      id,
      status: "QUEUED"
    }, { status: 202 });
  }

  if (request.method === "GET" && url.pathname.endsWith("/agent-pull")) {
    const jobs = await env.DB.prepare(
      `SELECT * FROM commands
       WHERE status = 'QUEUED'
       ORDER BY created_at ASC
       LIMIT 10`
    ).all();

    for (const job of jobs.results) {
      await env.DB.prepare(
        `UPDATE commands SET status = 'RUNNING' WHERE id = ?`
      ).bind(job.id).run();
    }

    return Response.json({
      status: "WORKING",
      jobs: jobs.results
    });
  }

  return Response.json({
    system: "TopShelfWebsites Automation Node",
    status: "WORKING"
  });
}
