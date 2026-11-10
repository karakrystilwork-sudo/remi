# Remi

The Official WFH Club's AI career assistant. Free trial version, $0 to run:

- **Hosting:** Cloudflare Workers (free plan)
- **AI:** Groq (free plan), model `openai/gpt-oss-120b`
- **Access:** testers enter an access code; no accounts yet

## Files

- `public/` website pages (landing page, chat)
- `src/worker.js` chat server; talks to Groq and keeps the AI key secret
- `src/remi-prompt.js` Remi's instructions (edit here)
- `wrangler.jsonc` Cloudflare settings

## Secrets (set in Cloudflare → your Worker → Settings → Variables and Secrets)

- `GROQ_API_KEY`: from console.groq.com → API Keys
- `ACCESS_CODES`: codes testers can use, separated by commas (for example `WFHTRIAL,MOMSWORK`)

## Free limits to know

Groq's free plan is shared across all users: roughly 30 requests/minute, 1,000 requests/day,
8,000 tokens/minute, 200,000 tokens/day on gpt-oss-120b. Remi's instructions are sent with every
message, so expect roughly 35 to 40 replies per day total. When the limit is hit, Remi shows a
"try again later" message; nothing is charged.
