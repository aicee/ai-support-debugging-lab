import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = `diag_${randomUUID()}`;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return NextResponse.json({
    status: "configuration_missing",
    provider: "ElevenLabs",
    hasApiKey: false,
    requestId,
    result: "check_not_run",
    diagnosticMessage: "ELEVENLABS_API_KEY is not configured. Add it as a local environment variable or Fly.io secret, then run this check again.",
  });

  try {
    // This reads account metadata only; it never requests paid audio generation.
    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    return NextResponse.json({
      status: response.ok ? "ok" : "provider_rejected_request",
      provider: "ElevenLabs",
      hasApiKey: true,
      requestId,
      result: response.ok ? "credentials_valid" : `provider_http_${response.status}`,
      diagnosticMessage: response.ok ? "The provider accepted the configured credential." : "The credential is present, but the provider rejected the safe account check. Verify the key and account environment.",
    });
  } catch {
    return NextResponse.json({ status: "unavailable", provider: "ElevenLabs", hasApiKey: true, requestId, result: "network_check_failed", diagnosticMessage: "The credential exists, but the provider could not be reached within the diagnostic timeout." });
  }
}
