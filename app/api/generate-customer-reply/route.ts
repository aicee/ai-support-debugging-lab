import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReplyRequest = {
  customerMessage?: unknown;
  incident?: unknown;
  logs?: unknown;
  apiResponse?: unknown;
  rootCause?: unknown;
  resolution?: unknown;
};

const text = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.slice(0, maxLength) : "";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        status: "configuration_missing",
        message: "OPENAI_API_KEY is not configured. Add it to the server environment to generate customer replies.",
      },
      { status: 503 },
    );
  }

  let body: ReplyRequest;
  try {
    body = await request.json() as ReplyRequest;
  } catch {
    return NextResponse.json({ message: "The request body must be valid JSON." }, { status: 400 });
  }

  const customerMessage = text(body.customerMessage, 5_000);
  const rootCause = text(body.rootCause, 2_000);
  const resolution = text(body.resolution, 2_000);
  if (!customerMessage || !rootCause || !resolution) {
    return NextResponse.json({ message: "Customer message, root cause, and resolution are required." }, { status: 400 });
  }

  const evidence = {
    incident: text(JSON.stringify(body.incident ?? {}), 4_000),
    customerMessage,
    logs: text(body.logs, 6_000),
    apiResponse: text(body.apiResponse, 4_000),
    rootCause,
    resolution,
  };

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_REPLY_MODEL || "gpt-4.1-mini",
        max_output_tokens: 350,
        instructions: "You are a senior Technical Support Engineer writing an enterprise SaaS incident update. Write a friendly, concise, technically accurate, non-blaming customer reply with no unnecessary jargon. When the confirmed findings identify a customer-relevant component by a safe public name or slug, such as a WordPress plugin, name that component because it makes the explanation actionable. Never expose secrets, full filesystem paths, internal-only identifiers, request IDs, raw logs, or speculative details. Preserve the investigation's action state: describe completed work in the past tense, distinguish recommendations from completed actions, and never ask the customer to repeat a step that support already completed. Clearly state what was found, what was done, the current status, and invite the customer to reply if the issue continues. Use a simple greeting and sign off as Technical Support. Do not use markdown headings or bullet points.",
        input: `Create the customer reply from this sanitized investigation record:\n${JSON.stringify(evidence, null, 2)}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!openAIResponse.ok) {
      return NextResponse.json(
        { message: "OpenAI could not generate a reply. Verify the server-side key and try again." },
        { status: 502 },
      );
    }

    const result = await openAIResponse.json() as {
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const reply = result.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text?.trim();

    if (!reply) {
      return NextResponse.json({ message: "OpenAI returned an empty reply. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ status: "ok", reply });
  } catch {
    return NextResponse.json(
      { message: "The reply service is temporarily unavailable. Your investigation data is still saved in this view." },
      { status: 503 },
    );
  }
}
