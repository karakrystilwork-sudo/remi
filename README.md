# Remi

The Official WFH Club's AI career assistant. Free trial version: access-code login, no database.

## Deploy on Vercel

1. Go to vercel.com, sign up with GitHub, click **Add New → Project**, and import `remi`.
2. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY`: your key from console.anthropic.com
   - `ACCESS_CODES`: codes testers can use, separated by commas (for example `WFHTRIAL,MOMSWORK`)
   - `ANTHROPIC_MODEL` (optional): defaults to `claude-sonnet-5-5`
3. Click **Deploy**.

## Control costs

In console.anthropic.com, set a monthly spend limit. To cut off a tester, remove their code from `ACCESS_CODES` and redeploy.

## Edit Remi's instructions

`lib/remi-prompt.js`
