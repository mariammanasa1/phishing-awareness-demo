export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/click") {
      const recipientId = url.searchParams.get("rid") || "unknown";
      const now = new Date().toISOString();
      const logEntry = {
        type: "training_link_click",
        recipientId,
        timestamp: now,
        ipHashNote: "IP not stored by this worker",
        country: request.cf?.country || "",
        city: request.cf?.city || "",
        userAgent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
      };

      console.log(JSON.stringify(logEntry));

      if (env.DB) {
        await env.DB.prepare(
          "INSERT INTO clicks (recipient_id, clicked_at, country, city, user_agent, referer) VALUES (?, ?, ?, ?, ?, ?)"
        )
          .bind(
            recipientId,
            now,
            logEntry.country,
            logEntry.city,
            logEntry.userAgent,
            logEntry.referer
          )
          .run();
      }

      return Response.redirect(`${url.origin}/login.html?rid=${encodeURIComponent(recipientId)}`, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
