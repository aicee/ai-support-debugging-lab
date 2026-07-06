import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = `diag_${randomUUID()}`;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({
    status: "configuration_missing",
    provider: "OpenAI",
    hasApiKey: false,
    requestId,
    result: "check_not_run",
    diagnosticMessage: "OPENAI_API_KEY is not configured. The app remains fully usable with simulated incident data.",
  });

  try {
    // Fetching one model's metadata is a small, non-generation authentication check.
    const response = await fetch("https://api.openai.com/v1/models/gpt-4.1-mini", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    return NextResponse.json({
      status: response.ok ? "ok" : "provider_rejected_request",
      provider: "OpenAI",
      hasApiKey: true,
      requestId,
      result: response.ok ? "credentials_valid" : `provider_http_${response.status}`,
      diagnosticMessage: response.ok ? "The provider accepted the configured credential." : "The credential is present, but OpenAI rejected the metadata check. Verify the key and project access.",
    });
  } catch {
    return NextResponse.json({ status: "unavailable", provider: "OpenAI", hasApiKey: true, requestId, result: "network_check_failed", diagnosticMessage: "The credential exists, but the provider could not be reached within the diagnostic timeout." });
  }
}
