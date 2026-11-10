import { REMI_PROMPT } from "./remi-prompt.js";

const MAX_TURNS = 20; // most recent messages sent to the AI
const MAX_CHARS = 15000; // per message (fits a pasted resume or job post)

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

function validCode(env, code) {
  const codes = String(env.ACCESS_CODES || "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  return codes.length > 0 && codes.includes(String(code || "").trim().toLowerCase());
}

async function chat(request, env) {
  if (!env.GROQ_API_KEY) return json({ error: "Remi isn't set up yet (missing AI key)." }, 500);
  if (!validCode(env, request.headers.get("x-access-code"))) return json({ error: "Invalid access code." }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request." }, 400); }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "No message to answer." }, 400);

  const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + env.GROQ_API_KEY },
    body: JSON.stringify({
      model: env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [{ role: "system", content: REMI_PROMPT }, ...messages],
      max_completion_tokens: 1500,
      reasoning_effort: "low",
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.log("Groq error", upstream.status, detail.slice(0, 500));
    const error = upstream.status === 429
      ? "Remi has hit today's free limit or is busy. Try again in a minute, or tomorrow."
      : "Remi couldn't answer. Try again.";
    return json({ error }, 502);
  }

  // Pass Groq's stream straight through; the browser reads it.
  return new Response(upstream.body, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-store" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      return chat(request, env);
    }
    return env.ASSETS.fetch(request); // website files in /public
  },
};
