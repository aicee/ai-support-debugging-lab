# Portfolio Case Study: AI Support Debugging Lab

## Overview

AI Support Debugging Lab is a full-stack internal support console that reflects both AI Technical Support Engineering and more than 10 years of WordPress and web hosting support experience. It turns production-support reasoning—usually hidden inside private tools—into a portfolio experience built from safe, synthetic incident data.

## Problem

Support engineering is hard to demonstrate publicly. Real work involves confidential customer reports, request logs, API payloads, infrastructure configuration, and incident communication. A portfolio project needed to show that depth without exposing customer data or turning the experience into a simple error-message quiz.

## Solution

I built 42 investigations across voice generation, streaming, conversational-agent tools, webhooks, OpenAI, Fly.io, WordPress, DNS, Cloudflare, hosting, SSL, email, malware, and performance. Each case asks the analyst to combine customer context with evidence from logs, requests, hosting state, DNS answers, configuration, and timelines. A completed RCA produces an internal incident report, followed by an optional OpenAI-generated customer reply that remains under analyst control.

## Technical Highlights

- Next.js 15, React 19, TypeScript, Tailwind CSS 4, Docker, and Fly.io
- Typed incident records with customer context, business impact, evidence, timeline, and resolution fields
- Server-side OpenAI Responses API integration with bounded input, timeouts, safe errors, and no client-exposed key
- Safe ElevenLabs and OpenAI credential diagnostics that never return credential values
- Standalone, non-root container bound to Fly.io's configured port
- Independent `/healthz` route and realistic deployment failure scenarios
- Web-infrastructure investigations grounded in 10+ years of WordPress and hosting support work
- Semantic Request Details and Observed Error evidence for non-API cases
- Responsive investigation console with keyboard-visible controls

## Support Workflow

1. Read the customer report and establish environment, scope, severity, and impact.
2. Review evidence across logs, API request/response, deployment, and environment tabs.
3. Correlate request IDs, timestamps, version changes, and failure boundaries.
4. Submit the most evidence-supported root-cause analysis.
5. Review the internal summary: root cause, evidence, impact, resolution, technical reasoning, and prevention.
6. Generate, edit, regenerate, and copy a concise customer reply.

## AI Integration

`POST /api/generate-customer-reply` accepts the customer message plus sanitized incident findings. The server prompts OpenAI for a friendly, concise, technically accurate, non-blaming enterprise support update. The prompt excludes unnecessary jargon and forbids exposing secrets, raw internal identifiers, or speculation. If `OPENAI_API_KEY` is absent or the provider is unavailable, the console displays a clear recoverable state and keeps the investigation usable.

## Screenshots to Capture

1. Homepage hero, incident count, and “Built to Demonstrate” section
2. Product filter across AI and web-infrastructure incidents
3. WordPress incident detail with customer and business-impact context
4. Cloudflare Flexible SSL redirect-loop investigation
5. DNS A-record incident with authoritative and origin evidence
6. A multi-tab ElevenLabs streaming or webhook investigation
7. Root-cause selection and complete internal incident summary
8. Customer Reply panel with generate, edit, regenerate, and copy controls
9. Project Notes page and responsive mobile investigation

## Portfolio Copy

**AI Support Debugging Lab** — An internal-style incident investigation platform demonstrating AI technical support alongside more than 10 years of WordPress and web hosting support experience. The app includes 42 realistic AI voice, API, deployment, WordPress, DNS, Cloudflare, hosting, SSL, email, malware, and performance cases. Analysts correlate production evidence, submit a root-cause analysis, review a structured incident report, and use OpenAI to draft an editable customer response.

The project demonstrates how I investigate ambiguous production failures, reason across API and deployment boundaries, protect credentials, document prevention work, and translate technical findings into clear enterprise customer communication.
