# AI Support Debugging Lab

AI Support Debugging Lab is an internal-style technical support console for investigating synthetic AI voice, API, deployment, WordPress, DNS, Cloudflare, hosting, SSL, email, malware, and performance incidents. It makes the daily reasoning of a Technical Support Engineer visible: understand the report, correlate evidence, identify the root cause, document the resolution, and send a clear customer update.

![AI Support Debugging Lab incident investigation interface](https://ai-support-debugging-lab.vercel.app/incident-investigation.jpg)

## Project overview

The lab contains 42 production scenarios spanning AI products and web infrastructure. Each case includes customer and business context, sanitized evidence, deployment or hosting state, environment details, a working timeline, an RCA decision, and an internal incident summary. After an investigation is complete, OpenAI can draft a customer-friendly reply for the analyst to review, edit, regenerate, and copy.

## Features

- AI voice support and conversational-agent scenarios
- API, webhook, OpenAI, and simulated Fly.io deployment troubleshooting
- WordPress and managed-hosting incidents
- DNS and Cloudflare troubleshooting
- SSL, email, malware, and website-performance support cases
- Foundational, Operational, and Escalation support levels
- Customer, plan, environment, region, affected-user, and start-time context
- Business impact, priority, estimated user impact, and revenue-risk assessment
- Evidence workspace for logs, requests, responses, deployment state, environment, timeline, and notes
- Evidence-backed RCA with root cause, impact, resolution, technical reasoning, and prevention
- OpenAI-assisted customer reply generation with edit, regenerate, and copy actions
- Graceful missing-key behavior and server-only provider credentials
- Safe provider diagnostics, Vercel rate limiting, and responsive UI

## Tech stack

- Next.js 15, React 19, and TypeScript
- Tailwind CSS 4
- Next.js route handlers and the OpenAI Responses API
- Typed local incident data
- Vercel deployment with server-side environment variables and WAF rate limiting

## Local setup

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/aicee/ai-support-debugging-lab.git
cd ai-support-debugging-lab
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Investigations work without provider keys; only live diagnostics and AI reply generation require their respective credentials.

## Environment variables

Create `.env.local` for optional local integrations. Never commit this file.

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Generates customer replies and enables the OpenAI diagnostic |
| `OPENAI_REPLY_MODEL` | No | Overrides the default `gpt-4.1-mini` reply model |
| `ELEVENLABS_API_KEY` | No | Enables the safe ElevenLabs credential diagnostic |

Provider keys are read only in server route handlers. The browser receives generated text and safe diagnostic state, never secret values.

## Vercel deployment

The live lab is deployed as a separate Vercel project at [ai-support-debugging-lab.vercel.app](https://ai-support-debugging-lab.vercel.app/). OpenAI credentials are stored as server-side Vercel environment variables, and the customer-reply route is protected by a production WAF rate limit. Fly.io appears in several synthetic investigation scenarios, but the application itself is not deployed to Fly.io.

## API routes

- `POST /api/generate-customer-reply` sends sanitized investigation context to OpenAI and returns a customer-ready draft.
- `GET /api/check-openai` performs a small server-side credential check.
- `GET /api/check-elevenlabs` performs a safe account-access check.
- `GET /healthz` returns lightweight application health.

## Screenshots

Recommended portfolio captures:

1. Homepage hero, “Built to Demonstrate,” and incident queue
2. Product filter showing AI and web-infrastructure groups
3. WordPress incident detail with Request Details and Observed Error tabs
4. Cloudflare Flexible SSL redirect-loop investigation
5. DNS A-record incident and correlated origin evidence
6. Submitted root-cause analysis and Investigation Summary
7. Customer Reply panel with generate, edit, regenerate, and copy actions
8. Project Notes page and mobile investigation view

The deployed application serves `public/incident-investigation.jpg` as the primary investigation interface preview. Add the remaining recommended captures as the project evolves.

## Portfolio value

This project demonstrates production incident investigation, AI API troubleshooting, voice and streaming support, WordPress and hosting operations, DNS and Cloudflare analysis, SSL and email delivery, malware response, performance debugging, safe secret handling, technical writing, and AI-assisted customer communication. It is designed as an operational support artifact rather than a generic tutorial, quiz, or chatbot demo.

## What I learned

- Strong support conclusions come from correlating weak signals across several evidence sources.
- A successful build is not proof of correct runtime ports, secrets, memory behavior, or environment isolation.
- Webhook consumers need fast acknowledgement, version-aware validation, replay safety, and idempotency.
- Binary and streaming responses require different operational checks than JSON APIs.
- AI-generated support communication should be grounded in confirmed findings and remain editable by the analyst.

See [PORTFOLIO_CASE_STUDY.md](PORTFOLIO_CASE_STUDY.md) and the in-app `/project-notes` page for the full project narrative.
